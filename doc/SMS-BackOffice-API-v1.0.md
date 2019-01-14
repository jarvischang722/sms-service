# SMS BackOffice API 接入文檔 v1.0



## <img src="C:\Users\Jun\Documents\API\SMS\icons\scroll.svg" width="50px" />Changes

| Date |   Content    |  By      | Version|
|------|--------------------|-------|-------|
|2019-01-15| Init version| Jun Chang| v1.0|
|| | | |
|| | | |
|| | | |
|| | | |
|| | | |
|| | | |
|| | | |

<div style="page-break-after: always;"></div> 


## <img src="C:\Users\Jun\Documents\API\SMS\icons\api.svg" width="50px" />Call API Mode 调用API方式

REST API

Method	        :  **POST| GET**

Format	        :  **JSON**

Uri prefix uri  : **/sms/backoffice**



**Example:**

Method		   : **POST**

URI			   :  **/sms/backoffice/login** 

Content-Type   :  **application/json; charset=utf-8**

Host		   : **[api server]**


**Request:**

```json
{
    "username": "admin",
    "password": "pass1234"
}
```

**API Response**

```json
{
    success: <true/false>,
    code: <result code>,
    message: <error message or normal message>,
    detail: {<any data>}
}
```



**Standard result:**

+ **success**	   : Boolean , means this action don’t find any error, if it’s false, should set "message" field.
	 **code**	   : see Error Code. 参见 错误代码 .
+ **message**  : any string , could be error or normal message.
	 **detail**	   : could be any data, depends api. 返回的内容细节

<div style="page-break-after: always;"></div> 



## <img src="C:\Users\Jun\Documents\API\SMS\icons\error.svg" width="50px" />Error Code 错误代码

| Code |                             Type                             | Description | Http status code |
| :--: | :----------------------------------------------------------: | :---------: | :--------------: |
|  0   |                         success                         | 成功 |       200        |





<div style="page-break-after: always;"></div> 

## API



### User



#### Login 登陸


Uri 		        :  **login**

Method  	:  **post**

Parameters :

|     Name      |                         Type                          |                         Description                          |
| :-----------: | :---------------------------------------------------: | :----------------------------------------------------------: |
| username |  string |          |
| password |  string |          |


Response :

```json
{
  "succuss": true,
  "code": 0,
  "detail": { 
     id: 1,
     token: "eyXhwIjoxNTE0MzQ2NzQwfQ.FXJyQ3MFNmyTIvbXodpvJWycV4Io2iAevdKzts......gvTLQ"
  }
}
```



code:

| Code |  Description |
| :--: |  :---------: |
|  0   |  success |




detail :

|    Name    |   Type   |  Description   |
|-------|------|-------|
| id | number| |
| token | string| |



### Draw 



#### Draw lottery 开奖


Uri 		:  **/draw/lottery**

Method  	:  **post**

Parameters :

|     Name      |                         Type                          |                         Description                          |
| :-----------: | :---------------------------------------------------: | :----------------------------------------------------------: |
| lucky_draw | string: only 8 letter | 開獎號碼 |



Response :

```json
{
  "succuss": true,
  "code": 0,
  "detail": { 
      period: xxxx
  }
}
```



code:

| Code |  Description |
| :--: |  :---------: |
|  0   |  success |




detail :

|    Name    |   Type   |  Description   |
|-------|------|-------|
| period | string| 期號 |





#### Check If Today Won The Draw 查詢今日是否开过奖


Uri 		:  **/draw/is_draw_today**

Method  	:  **get**

Parameters :

|     Name      |                         Type                          |                         Description                          |
| :-----------: | :---------------------------------------------------: | :----------------------------------------------------------: |
|  |   |          |



Response :

```json
{
  "succuss": true,
  "code": 0,
  "detail": { 
     today: '2019/01/30'
     is_draw: true,
     lucky_draw : 'xDrfSgag'
  }
}
```



code:

| Code |  Description |
| :--: |  :---------: |
|  0   |  success |




detail :

|    Name    |   Type   |  Description   |
|-------|------|-------|
| today | string | 今天日期 |
| is_draw | boolean | 今天是否開過獎 |
| lucky_draw | string| 開獎號碼 |



#### Draw History 开奖历史


Uri 		:  **/draw/history**

Method  	:  **get**

Parameters :

| Name      | Type   | Description                              |
| --------- | ------ | ---------------------------------------- |
| page      | number | `Optional`  页码                         |
| pagesize  | number | `Optional`  每页数量                     |
| draw_sta  | string | `Optional`  中獎狀態                     |
| draw_date | string | `Optional `  中獎日期 format: YYYY/MM/DD |




Response :

```json
{
  "succuss": true,
  "code": 0,
  "detail": { 
     list: []
  }
}
```



code:

| Code |  Description |
| :--: |  :---------: |
|  0   |  success |



detail :

|    Name    |   Type   |  Description   |
|-------|------|-------|
| list | array| |



list :

|    Name    |   Type   |  Description   |
|-------|------|-------|
| draw_datetime | string | 开奖日期時間 |
| lucky_draw | string | 中奖号码 |
| winner_mobile | string | 中奖人手機號 |



#### Get All Mobile and Lucky Draw 取得開獎號與对应的手机号列表*

*取得今天分发出去的开奖号码和对应的手机号列表*



Uri 		:  **/draw/all_mobile_draw**

Method  	:  **get**

Parameters :

| Name | Type | Description |
| ---- | ---- | ----------- |
|      |      |             |



Response :

```json
{
  "succuss": true,
  "code": 0,
  "detail": { 
     lucky_draw: 'xxxxxxxx' 
     list: []
  }
}
```



code:

| Code | Description |
| :--: | :---------: |
|  0   |   success   |



detail :

| Name | Type  | Description |
| ---- | ----- | ----------- |
| list | array |             |



list :

| Name          | Type   | Description      |
| ------------- | ------ | ---------------- |
| lucky_draw    | string | 今日發出的開獎號 |
| winner_mobile | string | 玩家手機號       |







### White List



#### Get White List  獲取白名單列表


Uri 		:  **/white_list/list**

Method  	:  **get**

Parameters :



|     Name      |                         Type                          |                         Description                          |
| :-----------: | :---------------------------------------------------: | :----------------------------------------------------------: |
| page      | number | `Optional`页码                        |
| pagesize  | number | `Optional`每页数量                    |



Response :

```json
{
  "succuss": true,
  "code": 0,
  "detail": { 
     list : []
   }
}
```


code:

| Code |  Description |
| :--: |  :---------: |
|  0   |  success |


detail :

|    Name    |   Type   |  Description   |
|-------|------|-------|
| list | array| |


list : 

|    Name    |   Type   |  Description   |
|-------|------|-------|
| id | number| |
| ips | string| |



#### Add White List  新增白名單


Uri 		:  **add_white_list**

Method  	:  **post**

Parameters :

|     Name      |                         Type                          |                         Description                          |
| :-----------: | :---------------------------------------------------: | :----------------------------------------------------------: |
| ips |  string |          |


Response :

```json
{
  "succuss": true,
  "code": 0
}
```

code:

| Code |  Description |
| :--: |  :---------: |
|  0   |  success |





#### Update White List  更新白名單


Uri 		:  **update_white_list**

Method  	:  **post**

Parameters :

|     Name      |                         Type                          |                         Description                          |
| :-----------: | :---------------------------------------------------: | :----------------------------------------------------------: |
| id |  number |          |
| ips |  string |          |


Response :

```json
{
  "succuss": true,
  "code": 0
}
```


code:

| Code |  Description |
| :--: |  :---------: |
|  0   |  success |



#### Delete White List  刪除白名單



Uri 		:  **/white_list/delete**

Method  	:  **post**

Parameters :

| Name |  Type  | Description |
| :--: | :----: | :---------: |
|  id  | number |             |
| ips  | string |             |



Response :

```json
{
  "succuss": true,
  "code": 0
}
```



code:

| Code | Description |
| :--: | :---------: |
|  0   |   success   |



### SMS


#### Get SMS List  獲取簡訊內容清單


Uri 	   :  **/sms/list**

Method  	:  **get**

Parameters :



|     Name      |                         Type                          |                         Description                          |
|---|---|---|
| page      | number | `Optional`页码                        |
| pagesize  | number | `Optional`每页数量                    |





Response :

```json
{
  "succuss": true,
  "code": 0,
  "detail: {
  	 list: []
  }
}
```



detail :

|    Name    |   Type   |  Description   |
|-------|------|-------|
| list | array |   |



list :

|    Name    |   Type   |  Description   |
|-------|------|-------|
| id | number |   |
| sms_text | string |   |



code:

| Code |  Description |
| :--: |  :---------: |
|  0   |  success |



#### Add SMS Text  新增簡訊發送文字


Uri 	   :  **/sms/add**

Method  	:  **post**

Parameters :

|     Name      |                         Type                          |                         Description                          |
| :-----------: | :---------------------------------------------------: | :----------------------------------------------------------: |
| sms_type |  string | 簡訊種類<br /> **VERIFICATION_CODE** : 驗證碼內容<br /> **NOTIFY_WILL_DRAW** : 通知即將開獎內容<br /> **NOTIFY_WINNING** : 通知中獎內容 |
| sms_text |  string |     簡訊內容     |
| send_date |  string |    `optinal` 指定發送日期     |



Response :

```json
{
  "succuss": true,
  "code": 0
}
```



code:

| Code |  Description |
| :--: |  :---------: |
|  0   |  success |



#### Update SMS Text 更新簡訊發送文字


Uri 	   :  **/sms/update**

Method  	:  **post**

Parameters :

|     Name      |                         Type                          |                         Description                          |
| :-----------: | :---------------------------------------------------: | :----------------------------------------------------------: |
| id |  string |     簡訊編號     |
| sms_text |  string |     簡訊內容     |
| send_date |  string |    `optinal` 指定發送日期     |

Response :

```json
{
  "succuss": true,
  "code": 0
}
```



code:

| Code |  Description |
| :--: |  :---------: |
|  0   |  success |





#### Delete SMS Text 刪除簡訊發送文字

Uri 	   :  **/sms/delete**

Method  	:  **post**

Parameters :

| Name |  Type  | Description |
| :--: | :----: | :---------: |
|  id  | string |  簡訊編號   |

Response :

```json
{
  "succuss": true,
  "code": 0
}
```



code:

| Code | Description |
| :--: | :---------: |
|  0   |   success   |

