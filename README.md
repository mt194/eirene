# Project-Eirene

### The next step to self-care therapy

<img src="https://res.cloudinary.com/cloudloom/image/upload/c_scale,h_200/v1650736199/samples/Profile/eirine_logo-01_msnmlh.jpg"  />

------

## Installation :

```
git clone https://github.com/mt194/eirene.git
```



------

## Setup :

* **Server** :

  ```
  cd .\backend
  
  node server_connect.js
  ```

  or

  ```
  nodemon server_connect.js
  ```

  

- **Client** :

  ```
  npm start
  ```

  

------

## .env file format :

```
#./backend/.env

PORT = 8080

CLIENT_PORT = 3000

MONGO_CONNECTION_URL = 'yourmongodburi'

JWT_SECRET = 'securekey'

EMAIL = 'anyemail'

EMAIL_PASSWORD = 'emailpass'

CONTACT_MAIL = "supportemail"

CLOUDINARY_URL = 'thisissecret'

NODE_ENV = 'production' or 'development'

LIVE_URL = "hostedlink"

```

