## NOTES

### General
- App was containerized with Docker as an exercise to learn docker. In retrospect, I should not of containerized it since it's only one container, and I don't plan on deploying the app.
- Because the app reads and writes to a single input and output file, it's not setup at the moment for deployment and being used by multiple users.

### To Do
1. [done] Save input information to an object first. This intermediary step will remove the need to have the front end layout match the order that the file needs to be written in.
2. Make the front end dynamic based on the number of nodes and members chosen (i.e. if the user wants 5 members, there should be 5 input boxes generated to enter information in).
3. [done] Make Fortran program output a JSON file that the server can use to render the results page.
4. Write thorough documentation for the user on how to input information properly, and how to interpret the results.
5. Incorporate user accounts: login/registration and authentication with cookie-session.
6. Incorporate database into the app where users can save their models.

### Docker
Build images:			`docker build -t structural-app .`
Run container:			`docker run -p 8080:8080 structural-app`
Restart container:		`docker restart <container_name>`
Remove container:		`docker rm <container_name>`
Remove image:			`docker rmi <image_id>`

### notes:
- Currently, the app can be run either local or in a container.


### Workflow
1. user submits structure data
2. data is sent as JSON object to server
3. server converts JSON data into input.txt file
4. server runs FORTRAN program
5. FORTRAN program outputs JSON object
5. server returns JSON object to front end
6. front end displays results to DOM