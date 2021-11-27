SIGN-UP :
1--check confirm password
2--genrate token
3--validation
4--compare (pass and confirm_pass)
5--delete confirm_pass
6--hashed password
7--save

Sign_in:
email:
password:
1--check email & hashed pass
3--generate token
3--validate
4--save

Sign_out:
1-verify token
2-find token in db
3-remove given token
4--save

UPDATE:
1--verify token
2--find token in db
3--check pass and confirm pass
4--update data
5--if confirm pass >>>compare (pass and confirm_pass)
6--save 


>>>>>>>>>>>>>first name:
VALIDATIONS:::::::
	string
	required
	alpha

>>>>>>>>>>>>lastname:
VALIDATIONS:::::::
	string
	required
	alpha

>>>>>>>>>>>>email:
VALIDATIONS:::::::
	String
	required
	isEmail
	unique: (if id is modified)

>>>>>>>>>>>>password:
VALIDATIONS::::::
	string
	required
	length(>=10)
	condition:(alphabet,number,special char)

>>>>>>>>>>Token[]:
VALIDATIONS:::::::
	string
	required
      

