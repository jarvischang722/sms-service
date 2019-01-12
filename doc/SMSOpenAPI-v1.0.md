# SMS Open API 接入文檔 v1.0



## <img src="C:\Users\Jun\Documents\API\SMS\icons\scroll.svg" width="50px" />Changes

| Date |   Content    |  By      | Version|
|------|--------------------|-------|-------|
|2019-01-09| Init version| Jun Chang| v1.0|
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

Uri prefix uri  : **/sms/openapi**



**Example:**

Method		   : **POST**

URI			   :  **/sms/openapi/send_verification_code** 

Content-Type   :  **application/json; charset=utf-8**

Host		   : **[api server]**

Connection	    : **close**

User-Agent	    : **Paw/3.0.14 (Macintosh; OS X/10.12.4) GCDHTTPRequest**

Content-Length : **255**



**Request:**

```json
{
    "merchant_code": "xxxxxxx",
    "mobile": "886938891988",
    "sign": "dca7015a53378db1d08a4c8d7d91584b637bf5c9"
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
|  1   |                  invalid signature                  | 非法签名 |       403        |
|  2   |               invalid merchant_code               | 非法商户号 |       403        |
|  3   |               invalid secure_key                | 非法安全秘钥 |       403        |
| 11 | invalid verification_code | 无效的验证码 |400|
| 12 | verification_code overtime | 验证码过期 |400|
| 13 | invalid mobile | 无效手机号 |400|

<div style="page-break-after: always;"></div> 

## <img src="C:\Users\Jun\Documents\API\SMS\icons\shield.svg" width="50px" />Security Mode 安全模式



+ **White IP 白名单 IP**

*Setup white ip on servers 服务器上设置白名单 IP*



+ **Merchant Code and Secure Key 商户号和安全秘钥 商户号和安全秘钥 **

*Any 32 chars(letter and number)*
*Will send by email*
*Testing key: dd35aPO0bd186dc6ace6We2e0fb48s70*



+ **Sign Key 签名秘钥 签名秘钥 签名秘钥**

*Any 32 chars(letter and number)*
*Will send by email*
*Testing key: dd35aPO0bd186dc6ace6We2e0fb48s70*



+ **Signature 签名**

*Concat all non-empty values to one string , append sign key to last, then use SHA1 to get signature*
*所有非空值连接成一个字符串，把上面的签名秘钥放到最后然使用 sha1 的方法生成签名 的方法生成签名*
*The order should be sorted by parameter name in alphabetical order*
*所有参数的顺序要按名字母*
*Ignore any json type field and sign field 忽略所有 忽略所有 json类型字段和 sign字段*
*Always use utf-8 所有参数默认编码 所有参数默认编码 utf-8*

<div style="page-break-after: always;"></div> 

## API



####  <img src="C:\Users\Jun\Documents\API\SMS\icons\plug.svg" width="36px" /> Send Verification Code  寄送驗證碼

寄送驗證碼到玩家手機，讓玩家收到驗證碼

*Send verification code to player's phone.*

*只有在IP白名单内的ip可以调用此api*

*Only ip include white list  can invoke  the api*



Uri 		        :  **send_verification_code **

Method  	:  **post**

Parameters :

|     Name      |                         Type                          |                         Description                          |
| :-----------: | :---------------------------------------------------: | :----------------------------------------------------------: |
| merchant_code | string: only letter and number and "_"   , size: 6-50 |                    商户号  merchant code                     |
| country_code  |                        string                         |       国际码  country code<br />**Note:** without  "+"       |
|    mobile     |                        string                         |                     手机号  phone number                     |
|    locale     |                        string                         | `Optional`<br />語系 Language <br />**Note:**Default : en, <br />Support language : en, zh-cn |
|     sign      |                        string                         |                          signature                           |



Response :

```json
{
  "succuss": true,
  "code": 0,
  "detail": { }
}
```



code:

| Code |  Description |
| :--: |  :---------: |
|  0   |  success |
|  1   |  invalid signature 非法签名 |
|  2   |  invalid merchant_code 非法商户号 |



detail :

|    Name    |   Type   |  Description   |
|-------|------|-------|
| || |



#### <img src="C:\Users\Jun\Documents\API\SMS\icons\plug.svg" width="36px" />Check Verification  Code  檢查驗證碼

*檢查玩家所輸入的驗證碼是否與系統寄送的一致*

*Check if the verification code entered by player  is  consistent*



Uri 		 	:  **check_verification_code **


Method  	:  **post**

Parameters :

|       Name        |                         Type                          |                   Description                    |
| :---------------: | :---------------------------------------------------: | :----------------------------------------------: |
|   merchant_code   | string: only letter and number and "_"   , size: 6-50 |              商户号  merchant code               |
|   country_code    |                        string                         | 国际码  country code<br />**Note:** without  "+" |
|      mobile       |                        string                         |       手机号<br />  player's phone number        |
| verification_code |                        string                         |            验证码  Verification code             |
|       sign        |                        string                         |                    signature                     |



Response :

```json
{
  "succuss": true,
  "code": 0,
  "detail": { 
  	 "lucky_draw": "XsISW5t"
  }
}
```



code:

| Code |  Description |
| :--: |  :---------: |
|  0   |  success |
|  1   |  invalid signature 非法签名 |
|  2   |  invalid merchant_code 非法商户号 |
| 11 | invalid verification_code 无效验证码 |
| 12 | verification_code overtime 验证码过期 |



detail :

|    Name    |       Type        |                 Description                  |
|-------|------|-------|
| lucky_draw |string:  8 letter| 开奖号码  lucky draw number |




#### <img src="C:\Users\Jun\Documents\API\SMS\icons\plug.svg" width="36px" />Query Lucky Draw  查詢開獎號碼

*查詢開獎號碼*

*Query lucky draw*



Uri 			:  **query_lucky_draw**


Method  	:  **get**


Parameters :

|     Name      |                         Type                          |                   Description                    |
| :-----------: | :---------------------------------------------------: | :----------------------------------------------: |
| merchant_code | string: only letter and number and "_"   , size: 6-50 |              商户号  merchant code               |
| country_code  |                        string                         | 国际码  country code<br />**Note:** without  "+" |
|    mobile     |                        string                         |       手机号  <br />player's phone number        |
|     sign      |                        string                         |                    signature                     |



Response :

```json
{
  "succuss": true,
  "code": 0,
  "detail": { 
  	 "lucky_draw": "XsISW5t"
  }
}
```



code:

| Code |  Description |
| :--: |  :---------: |
|  0   |  success |
|  1   |  invalid signature 非法签名 |
|  2   |  invalid merchant_code 非法商户号 |
| 13 | invalid mobile 无效手机号 |



detail :

|    Name    |       Type        |                 Description                  |
|-------|------|-------|
| lucky_draw |string:  8 letter| 开奖号码<br />lucky draw number |





#### <img src="C:\Users\Jun\Documents\API\SMS\icons\plug.svg" width="36px" />Query Is Winning 查詢是否中獎

*返回是否中獎*

*Check if the  lucky_draw is winning*



Uri 		        :  **query_is_winning **

Method  	:  **get**

Parameters :

|     Name      |                         Type                          |                   Description                    |
| :-----------: | :---------------------------------------------------: | :----------------------------------------------: |
| merchant_code | string: only letter and number and "_"   , size: 6-50 |              商户号  merchant code               |
| country_code  |                        string                         | 国际码  country code<br />**Note:** without  "+" |
|    mobile     |                        string                         |        手机号<br />Player's phone number         |
|  lucky_draw   |                        string                         |         开奖号码<br />lucky draw number          |
|     sign      |                        string                         |                    signature                     |


Response :

```json
{
  "succuss": true,
  "code": 0,
  "detail": { 
  	 "isWinning": true
  }
}
```



code:

| Code |  Description |
| :--: |  :---------: |
|  0   |  success |
|  1   |  invalid signature 非法签名 |
|  2   |  invalid merchant_code 非法商户号 |
| 13 | invalid mobile 无效手机号 |



detail :

|    Name    |       Type        |                 Description                  |
|-------|------|-------|
| isWinning |Boolean| Is this phone number winning?<br />这个电话号码是否中奖 |



