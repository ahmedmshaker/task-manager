## Task Manager Node js App
this app contains 15 APIs and it's divided to two sections 
</br>
<li>Users APIs</li>
<li>User Tasks APIs</li>
for the APIs check [Task Manager APIs.postman_collection](task-manager-apis.postman_collection.json)

![Screenshot](images/apis.png)


## if you want to run the app using docker you can use
generated two container for [mongodb , current app] and combined them using docker compose check [docker-compose.yml](docker-compose.yml)
 ```bash
 docker compose up
 ```



## dependencies
[express](https://www.npmjs.com/package/express)
[mongoose](https://www.npmjs.com/package/mongoose)
[multer](https://www.npmjs.com/package/multer)
[jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
[bcryptjs](https://www.npmjs.com/package/bcryptjs)
[validator](https://www.npmjs.com/package/validator)
