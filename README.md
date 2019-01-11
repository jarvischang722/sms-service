### SMS service 

* open API
* backoffice API


1. Install package
```
yarn install
```

2. Configuration
```
cp  ./src/db/config/{env}.json.sample  ./src/db/config/{env}.json   # for DB 
cp  ./src/services/open/config/{env}.json.sample ./src/services/open/config/{env}.json   # for open api service
cp  ./src/services/backoffice/config/{env}.json.sample ./src/backoffice/open/config/{env}.json  for backoffice api service
cp  ./src/sms/config/default.json.sample  ./src/sms/config/default.json   # for sms module
```

3. Run
```
yarn start
``` 

