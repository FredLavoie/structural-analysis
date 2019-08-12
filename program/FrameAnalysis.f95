!*********************************************************************!
!                                                                     !
!                                                                     !
!                      FRAME ANALYSIS PROGRAM                         !
!                                                                     !
!                         FREDERIC LAVOIE                             !
!                            #0415381                                 !
!                                                                     !
!                                                                     !
!*********************************************************************!

! NOMENCLATURE
!---------------------------------------------------------------------
!nj = NUMBER OF NODES
!nm = NUMBER OF MEMBERS
!npj = NUMBER OF LOADED JOINTS
!nmp = NUMBER OF MATERIAL PROPERTIES
!npm = NUMBER OF LOADED MEMBERS
!nxsp = NUMBER OF CROSS-SECTIONS
!neq = NUMBER OF EQUATIONS TO BE SOLVED
!npc = NUMBER OF LOADED CASES
!x,y = CO-ORDINATES
!idf = DEGREE OF FREEDOM
!zi = MOMENT OF INERTIA
!em = ELASTIC MODULOUS
!fj = APPLIED LOADS MATRIX
!xsp = CROSS-SECTIONAL PROPERTIES
!nxsp = NUMBER OF CROSS-SECTIONAL PROPERTIES
!mcp = MEMBER CONNECTIVITY
!acs = DISPLACEMENT VECTOR
!im = MOMENT OF INERTIA
!nip = NUMBER OF MOMENT OF INERTIAS
!xdst = POINT LOAD DISTANCE FROM LEFT
!PL = POINT LOAD MAGNITUDE
!UDL = UDL MAGNITUDE
!*********************************************************************

program FrameAnalysis

real,dimension(:,:),allocatable::a,fj,acs,ds,xdst,PL,UDL
real,dimension(:,:,:),allocatable::Aml
real,dimension(:),allocatable::x,y,em,xsp,q,im
integer,dimension(:),allocatable::idf
integer,dimension(:,:),allocatable:: mcp

!To compile f95 to executable: gfortran -o <executable> <source_code.f95>

!OPEN INPUT FILE AS UNIT 5
!OPEN OUTPUT FILE AS UNIT 8

open(5,file="/Users/fredericlavoie/Documents/structural_analysis/program/data_in.txt")
open(8,file="/Users/fredericlavoie/Documents/structural_analysis/program/data_out.txt")

!*********************************************************************
! READ INPUT DATA
!*********************************************************************

!(1)INITIALIZE DATA
read(5,*)nj,nm,nmp,nxsp,nip,npc
neq=nj*3
allocate (acs(neq,npc),q(neq),a(neq,neq),ds(neq,npc),fj(neq,npc))
allocate (xdst(nm,npc),PL(nm,npc),UDL(nm,npc),Aml(6,nm,npc))
!(2)JOINT DATA
allocate (idf(neq),x(nj),y(nj))
do k=1,nj
  read(5,*)j,x(j),y(j),idf(3*j-2),idf(3*j-1),idf(3*j)
end do
!(3)MEMBER PROPERTIES
allocate (em(nmp))
do k=1,nmp
  read(5,*)j,em(j)
end do
!(4)CROSS-SECTIONAL PROPERTIES
allocate (xsp(nxsp))
do k=1,nxsp
  read(5,*)j,xsp(j)
end do
!(5)MOMENT OF INERTIAS
allocate(im(nip))
do k=1,nip
  read(5,*)j,im(j)
end do
!(6)MEMBER DATA
allocate (mcp(nm,5))
do k=1,nm
  read(5,*)j,mcp(j,1:5)
end do
!SET BANDWIDTH
nbw=0
nbt=0
do i=1,nm
  nbt=mcp(i,2)*3-(mcp(i,1)*3-2)+1
  if (nbt>nbw) then
    nbw=nbt
  end if
end do
!*********************************************************************
! PROGRAM INFORMATION
!*********************************************************************
write(8,*)
write(8,500)
write(8,505)'PLANE FRAME ANALYSIS PROGRAM'
write(8,505)'DEVELOPED BY: FREDERIC LAVOIE'
write(8,500)
write(8,*)
write(8,*)
!*********************************************************************
! PRINTOUT INPUT DATA
!*********************************************************************
write(8,500)
write(8,507)'INPUT DATA'
write(8,500)
write(8,*)
write(8,501)'NUMBER OF JOINTS =',nj
write(8,501)'NUMBER OF MEMBERS =',nm
write(8,501)'NUMBER OF LOAD CASES =',npc
write(8,*)
write(8,*)
write(8,*)'JOINT DATA'
write(8,500)
write(8,503)
write(8,504)
do j=1,nj 
  write(8,502)j,x(j),y(j),idf(3*j-2),idf(3*j-1),idf(3*j)
end do
write(8,*)
write(8,*)
write(8,*)'MEMBER PROPERTY DATA'
write(8,500)
write(8,*)
write(8,509)
write(8,510)
do j=1,nmp
  write(8,506)j,em(j)
end do
write(8,*)
write(8,*)
write(8,*)'CROSS-SECTIONAL PROPERTY DATA'
write(8,500)
write(8,*)
write(8,511)
do j=1,nxsp
  write(8,512)j,xsp(j)
end do
write(8,*)
write(8,*)
write(8,*)'MOMENT OF INERTIAS'
write(8,500)
write(8,*)
write(8,525)
write(8,524)
do j=1,nip
  write(8,526)j,im(j)
end do
write(8,*)
write(8,*)
write(8,*)'MEMBER DATA'
write(8,500)
write(8,*)
write(8,513)
write(8,514)
do j=1,nm
  write(8,508)j,mcp(j,1:5)
end do
write(8,*)
write(8,*)
write(8,*)'JOINT LOADS'
write(8,500)
write(8,*)

!*********************************************************************
! CALL SUBROUTINES
!*********************************************************************

call fstiff(x,y,em,im,xsp,mcp,idf,nj,nm,neq,nbw,a,nxsp,nmp,nip)

fj(:,:)=0
xdst(:,:)=0
PL(:,:)=0
UDL(:,:)=0
do i=1,npc
  read(5,*)npj,npm    
  do k=1,npj
    read(5,*)j,fj(j*3-2,i),fj(j*3-1,i),fj(j*3,i)
  end do
  do k=1,npm
    read(5,*)j,xdst(j,i),PL(j,i),UDL(j,i)
  end do
  if (npc>1) then
    write(8,518)'LOAD CASE',i
    write(8,515)
    write(8,516)
    do j=1,nj
      write(8,517)j,fj(j*3-2,i),fj(j*3-1,i),fj(j*3,i)
    end do
    write(8,528)
    write(8,529)
    do j=1,nm
      write(8,527)j,xdst(j,i),PL(j,i),UDL(j,i)
    end do
    write(8,*)
    else
    write(8,515)
    write(8,516)
    do j=1,nj
      write(8,517)j,fj(j*3-2,1),fj(j*3-1,1),fj(j*3,1)
    end do
    write(8,528)
    write(8,529)
    do j=1,nm
      write(8,527)j,xdst(j,1),PL(j,1),UDL(j,1)
    end do
    write(8,*)
  end if
end do

call loads(x,y,nm,em,xsp,im,nmp,nip,nxsp,npc,UDL&
&,xdst,PL,neq,fj,idf,mcp,acs,Aml)

call eqn(a,acs,nbw,neq,npc)

!*********************************************************************
! PRINTOUT PRIMARY UNKNOWNS
!*********************************************************************
write(8,*)
write(8,500)
write(8,519)'PRIMARY UNKNOWNS'
write(8,500)
write(8,*)
write(8,521)
write(8,522)
write(8,523)
do i=1,npc
  if (npc>1) then
    write(8,*)
    write(8,518)'LOAD CASE',i
    do j=1,nj
      write(8,520)j,acs(j*3-2,i),acs(j*3-1,i),acs(j*3,i)
    end do
    else
    do j=1,nj
      write(8,520)j,acs(j*3-2,1),acs(j*3-1,1),acs(j*3,1)
    end do
  end if
end do

!*********************************************************************
! PRINTOUT SECONDARY UNKNOWNS
!*********************************************************************
write(8,*)
write(8,500)
write(8,519)'SECONDARY UNKNOWNS'
write(8,500)
write(8,*)
write(8,*)

call mforce(x,y,em,xsp,mcp,idf,nj,nm,neq,nmp,npc,acs,fj,nxsp,im&
&,nip,Aml)

!*********************************************************************
! FORMAT STATEMENTS
!*********************************************************************
500 format(71('-'))
501 format(a25,i3)
502 format(i3,4x,f8.1,2x,f8.1,4x,b2,2x,b2,2x,b2)
503 format('JOINT',7x,'COORDINATES',9x,'D.O.F')
504 format('NUMBER',7x,'X',7x,'Y',8x,'X',3x,'Y',3x,'R')
505 format(17x,a35)
506 format(i3,2x,es10.1)
507 format(17x,a25)
508 format(4x,i3,7x,i3,5x,i3,8x,i3,11x,i3,11x,i3)
509 format(8x,'ELASTIC')
510 format(2x,'#',5x,'MODULUS')
511 format(2x,'#',6x,'AREA')
512 format(i3,2x,es10.1)
513 format(3x,'MEMBER',5x,'MEMBER  NODES',4x,' MATERIAL ',4x,&
'X-SECTIONAL',4x,' INERTIA')
514 format(3x,'NUMBER',5x,'j-END   k-END',4x,'PROPERTY #',4x,&
'PROPERTY # ',4x,'PROPERTY #')
515 format(2x,'JOINT',23x,'JOINT LOADS')
516 format(2x,'NUMBER',13x,'X',13x,'Y',10x,'MOMENT')
517 format(2x,i3,8x,f10.2,4x,f10.2,4x,f10.2)
518 format(a10,i3)
519 format(14x,a35)
520 format(4x,i3,5x,es14.3,4x,es14.3,4x,es14.3)
521 format(3x,'  NODE  ',21x,'JOINT')
522 format(3x,' NUMBER ',20x,'DISPLACEMENT')
523 format(20x,'X',17x,'Y',14x,'ROTATION')
524 format(2x,'#',5x,'INERTIA')
525 format(8x,'MOMENT OF')
526 format(i3,5x,es10.1)
527 format(2x,i3,8x,f10.2,4x,es10.2,5x,es10.2)
528 format(2x,'MEMBER',21x,'MEMBER LOADS')
529 format(2x,'NUMBER',10x,'X-DIST.',10x,'PL',10x,'UDL')
!*********************************************************************
!*********************************************************************
!*********************************************************************
!                            SUBROUTINES
!*********************************************************************
!*********************************************************************
!*********************************************************************
contains
!*********************************************************************
!*********************************************************************
subroutine fstiff(x,y,em,im,xsp,mcp,idf,nj,nm,neq,nbw,a,nxsp,nmp,nip)
real,dimension(nmp)::em
real,dimension(nip)::im
real,dimension(neq,neq)::a
real,dimension(nj)::x,y
real,dimension(nxsp)::xsp
real,dimension(6,6)::sm,r,rt,smrt,sms
integer,dimension(neq)::idf
integer,dimension(nm,5)::mcp
integer,dimension(6)::id
real::iim

sm(:,:)=0
r(:,:)=0
rt(:,:)=0
smrt(:,:)=0
sms(:,:)=0
a(:,:)=0

do i=1,nm
  xj=x(mcp(i,1))
  yj=y(mcp(i,1))
  xk=x(mcp(i,2))
  yk=y(mcp(i,2))
  eem=em(mcp(i,3))
  xxsp=xsp(mcp(i,4))
  iim=im(mcp(i,5))

  call fmstiff(xj,yj,xk,yk,eem,xxsp,iim,sm)
  call frotmat(xj,yj,xk,yk,r,rt)
  call multmat(6,6,6,rt,sm,smrt)
  call multmat(6,6,6,smrt,r,sms)

  id(1)=3*mcp(i,1)-2
  id(2)=3*mcp(i,1)-1
  id(3)=3*mcp(i,1)
  id(4)=3*mcp(i,2)-2
  id(5)=3*mcp(i,2)-1
  id(6)=3*mcp(i,2)
  

  !ASSEMBLE GLOBAL STIFFNESS MATRIX
  do nr=1,6
    do nc=1,6
  !CHECK IF STIFFNESS COEFFICIENT IS ABOVE DIAGONAL, ONLY
  !STORE VALUES ON OR ABOVE
    kn=id(nr)-id(nc)
    if(kn<0) goto 110
    ic=id(nc)
    ir=kn+1
    a(ir,ic)=a(ir,ic)+sms(nr,nc)
110 end do
  end do
end do

!APPLY JOINT RESTRAINT
do j=1,neq
  ic=j
  if(idf(ic)>0)then
    a(1,ic)=1.0
!PUT ZEROS INTO ROW AND COLUMN
    ir=ic
    do m=2,nbw
      a(m,ic)=0.0
      ir=ir-1
      if(ir>0) then
        a(m,ir)=0.0
      end if
    end do
  end if
end do

end subroutine fstiff
!*********************************************************************
!*********************************************************************
subroutine fmstiff(xa,ya,xb,yb,em,xsa,im,sm)
real,dimension(6,6)::sm
real::im
sm(:,:)=0.0
!COMPUTE LENGTH
dx=xb-xa
dy=yb-ya
d=(dx**2+dy**2)**0.5
!COMPUTE AE/L
!COMPUTE EI/L
aed=xsa*em/d
sm(1,1)=aed
sm(4,4)=aed
sm(1,4)=-aed
sm(4,1)=-aed
sm(2,2)=12*em*im/(d**3)
sm(5,5)=12*em*im/(d**3)
sm(2,5)=-12*em*im/(d**3)
sm(5,2)=-12*em*im/(d**3)
sm(3,2)=6*em*im/(d**2)
sm(2,3)=6*em*im/(d**2)
sm(6,2)=6*em*im/(d**2)
sm(2,6)=6*em*im/(d**2)
sm(5,3)=-6*em*im/(d**2)
sm(3,5)=-6*em*im/(d**2)
sm(6,5)=-6*em*im/(d**2)
sm(5,6)=-6*em*im/(d**2)
sm(3,3)=4*em*im/d
sm(6,6)=4*em*im/d
sm(6,3)=2*em*im/d
sm(3,6)=2*em*im/d

end subroutine fmstiff
!*********************************************************************
!*********************************************************************
subroutine frotmat(xa,ya,xb,yb,r,rt)               
real,dimension(6,6)::r,rt
r(:,:)=0.0
rt(:,:)=0.0
!COMPUTE LENGTH
dx=xb-xa
dy=yb-ya
d=(dx**2+dy**2)**0.5
!FORM ROTATION MATRIX
r(1,1)=dx/d
r(1,2)=dy/d
r(2,1)=dy/d*(-1)
r(2,2)=dx/d
r(3,3)=1
r(4,4)=dx/d
r(4,5)=dy/d
r(5,4)=dy/d*(-1)
r(5,5)=dx/d
r(6,6)=1
!TRANSPOSE
do jj=1,6
  do ii=1,6
    rt(jj,ii)=r(ii,jj)
  end do
end do
end subroutine frotmat
!*********************************************************************
!*********************************************************************
subroutine multmat(m,n,np,a,b,c)
real,dimension(m,n)::a
real,dimension(n,np)::b
real,dimension(m,np)::c
c(:,:)=0.0
do mm=1,m
  do ji=1,np
    do kk=1,n
      c(mm,ji)=c(mm,ji)+a(mm,kk)*b(kk,ji)
    end do
  end do
end do
end subroutine multmat
!*********************************************************************
!*********************************************************************
subroutine loads(x,y,nm,em,xsp,im,nmp,nip,nxsp,npc,UDL&
&,xdst,PL,neq,fj,idf,mcp,acs,Aml)

real::a,b,px,py,iim
real,dimension(neq,npc)::fj,acs,aams
integer,dimension(neq)::idf
integer,dimension(nm,5)::mcp
integer,dimension(6)::id
real,dimension(nj)::x,y
real,dimension(nmp)::em
real,dimension(nxsp)::xsp
real,dimension(nip)::im
real,dimension(nm,npc)::xdst,PL,UDL
real,dimension(6,1)::ams,am
real,dimension(6,nm,npc)::Aml
real,dimension(6,6)::r,rt

acs(:,:)=0
aams(:,:)=0
Aml(:,:,:)=0

do i=1,npc
  do j=1,nm
      
    am(:,:)=0
    ams(:,:)=0
    id(:)=0
    r(:,:)=0
    rt(:,:)=0

        
    xj=x(mcp(j,1))
    yj=y(mcp(j,1))
    xk=x(mcp(j,2))
    yk=y(mcp(j,2))
    eem=em(mcp(j,3))
    xxsp=xsp(mcp(j,4))
    iim=im(mcp(j,5))
    
    dx=xk-xj
    dy=yk-yj
    d=(dx**2+dy**2)**0.5
    
    id(1)=3*mcp(j,1)-2
    id(2)=3*mcp(j,1)-1
    id(3)=3*mcp(j,1)
    id(4)=3*mcp(j,2)-2
    id(5)=3*mcp(j,2)-1
    id(6)=3*mcp(j,2)
    
    
    px=PL(j,i)*dy/d
    py=PL(j,i)*dx/d
    a=xdst(j,i)
    b=d-a
    Aml(1,j,i)=Aml(1,j,i)-(px*b/d)
    Aml(2,j,i)=Aml(2,j,i)-((py*b**2)*(3*a+b)/d**3)
    Aml(3,j,i)=Aml(3,j,i)-((py*b**2*a)/d**2)
    Aml(4,j,i)=Aml(4,j,i)-(px*a/d)
    Aml(5,j,i)=Aml(5,j,i)-((py*a**2)*(a+3*b)/d**3)
    Aml(6,j,i)=Aml(6,j,i)+((py*a**2*b)/d**2)
    
    
    wx=UDL(j,i)*dy/d
    wy=UDL(j,i)*dx/d
    Aml(1,j,i)=Aml(1,j,i)-(wx*D/2)
    Aml(2,j,i)=Aml(2,j,i)-(wy*D/2)
    Aml(3,j,i)=Aml(3,j,i)-((wy*d**2)/12)
    Aml(4,j,i)=Aml(4,j,i)-(wx*d/2)
    Aml(5,j,i)=Aml(5,j,i)-(wy*d/2)
    Aml(6,j,i)=Aml(6,j,i)+((wy*d**2)/12)

  
    call frotmat(xj,yj,xk,yk,r,rt)
    
    do k=1,6
      am(k,1)=Aml(k,j,i)
    end do
    
    call multmat(6,6,1,rt,am,ams)
    
    do k=1,6
      aams(id(k),i)=aams(id(k),i)+ams(k,1)
    end do
    
  end do
end do

do k=1,npc
  do j=1,neq
    acs(j,k)=fj(j,k)-aams(j,k)
!CHECK RESTRAINT CONDITIONS
    if(idf(j)>0)then
      acs(j,k)=0.0
    end if
  end do
end do
end subroutine loads
!*********************************************************************
!*********************************************************************
subroutine eqn(a,b,m,n,x)
!   call eqn(a,acs,nbw,neq,npc)

integer:: k,l,nm,n,mr,j,jl,i,m1,max,ii,i1,kk,min,m,z,x
real:: pivot,c,sum
real,dimension(n,n):: a
real,dimension(n,x):: b

nm=n-1
do 200 k=1,nm
  pivot=a(1,k)
  mr=min(m,n-k+1)

  do 180 l=2,mr
      c=a(l,k)/pivot
!            -   0   +
     if (c) 150,180,150
150    i=0
       j=k+l-1

       do 160 jl=l,mr
         i=i+1
160      a(i,j)=a(i,j)-a(jl,k)*c
180      a(l,k)=c

200  continue
!z=1          
do z=1,x
  !FORWARD SUBSTITUTION  (ld) * y = b TO STORE y IN b
  m1=m-1
  b(1,z)=b(1,z)/a(1,1)
  do i=2,n
    l=max(1,i-m1)
    sum=0.0
    ii=i+1
    i1=i-1
    do k=l,i1
      j=ii-k
      sum=sum+a(j,k)*b(k,z)*a(1,k)
    end do
    b(i,z)=(b(i,z)-sum)/a(1,i)
  end do
  !BACK SUBSTITUTION  l tr * x = y  TO STORE  x IN b.
  do kk=1,nm
    i=n-kk
    i1=min(n,i+m1)
    sum=0.0
    l=i+1
    do k=l,i1
      j=k-i+1
      sum=sum+a(j,i)*b(k,z)
    end do
    b(i,z)=b(i,z)-sum
  end do
end do
end subroutine eqn
!*********************************************************************
!*********************************************************************
subroutine mforce(x,y,em,xsp,mcp,idf,nj,nm,neq,nmp,npc,acs,fj,&
nxsp,im,nip,Aml)
real,dimension(nj)::x,y
integer,dimension(6)::id
real,dimension(neq,npc)::fj,acs,dms,am,ams
real,dimension(nmp)::em
real,dimension(nip)::im
real,dimension(nxsp)::xsp
real,dimension(6,nm,npc)::Aml
integer,dimension(neq)::idf
integer,dimension(nm,5)::mcp
real,dimension(6,6)::sm,r,rt,smr
real::iim
real,dimension(neq)::ar

write(8,105)
write(8,*)
do k=1,npc
  ar(:)=0
  do i=1,nm

    am(:,:)=0
    dms(:,:)=0
    ams(:,:)=0
    r(:,:)=0
    rt(:,:)=0
    sm(:,:)=0
    smr(:,:)=0

    
    xj=x(mcp(i,1))
    yj=y(mcp(i,1))
    xk=x(mcp(i,2))
    yk=y(mcp(i,2))
    eem=em(mcp(i,3))
    xxsp=xsp(mcp(i,4))
    iim=im(mcp(i,5))
    call fmstiff(xj,yj,xk,yk,eem,xxsp,iim,sm)
    call frotmat(xj,yj,xk,yk,r,rt)
    call multmat(6,6,6,sm,r,smr)
    id(1)=3*mcp(i,1)-2
    id(2)=3*mcp(i,1)-1
    id(3)=3*mcp(i,1)
    id(4)=3*mcp(i,2)-2
    id(5)=3*mcp(i,2)-1
    id(6)=3*mcp(i,2)
    do j=1,6
      dms(j,1)=dms(j,1)+acs(id(j),k)
    end do
    call multmat(6,6,1,smr,dms,am)
!   PRINT {Am}i
    do j=1,6
      am(j,1)=am(j,1)+Aml(j,i,k)
    end do
    write(8,104)i,am(1,1),am(2,1),am(3,1)
    write(8,108)am(4,1),am(5,1),am(6,1)
!   SUM THE MEMBER FORCES INTO REACTIONS
    call multmat(6,6,1,rt,am,ams)
!   STORE FIXED END FORCES FOR SUPPORTED JOINTS
!   {Ar}
    do j=1,6
      if(idf(id(j))>0) then
        ar(id(j))=ar(id(j))+ams(j,1)
      end if
    end do
  end do
! INCLUDE JOINT LOADS THAT OCCURE AT SUPPORTS
  

  do j=1,neq
    if(idf(j)>0) then
      ar(j)=ar(j)-fj(j,k)
    end if
  end do
! PRINT OUT REACTIONS
  write(8,*)
  write(8,101)
  write(8,*)
  write(8,102)
  write(8,103)
  do j=1,nj
    if((idf(j*3-2)+idf(j*3-1)+idf(j*3))>0) then
      write(8,100)j,ar(j*3-2),ar(j*3-1),ar(j*3)
    end if
  end do
  write(8,*)
  write(8,106)
  write(8,*)
  if (npc>1)then
    if (k<npc)then
      write(8,107)
      write(8,*)
    end if
  end if
end do
100 format(4x,i3,5x,es12.3,4x,es12.3,4x,es12.3)
101 format(3x,'SUPPORT  REACTIONS')
102 format(3x,'JOINT')
103 format(3x,'NUMBER',9X,'X',15x,'Y',13x,'MOMENT')
104 format(3x,'MEMBER',1x,i3,4x,es12.3,4x,es12.3,4x,es12.3)
105 format(3x,'MEMBER END FORCES')
106 format(71('-'))
107 format(3x,'MEMBER END FORCES')
108 format(17x,es12.3,4x,es12.3,4x,es12.3)
end subroutine mforce
!*********************************************************************
!*********************************************************************
end program
