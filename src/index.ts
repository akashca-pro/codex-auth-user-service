import { User } from "./domain/entities/User";
import { AuthProvider } from "./domain/enums/AuthProvider";
import { UserRole } from "./domain/enums/UserRole";
import { LocalAuthentication, OAuthAuthentication } from "./domain/valueObjects/UserAuthentication";

const user = User.create({
   role : UserRole.USER,
   username : 'coder',
   email : 'akash12@gmail.com',
   authentication : new LocalAuthentication('password'),
   avatar : 'picture',
   firstName : 'aka',
   lastName : 'ca',
   country : 'india'
})


const admin = User.create({
    role : UserRole.ADMIN,
    username : 'owner',
    email : 'admin@gmail.com',
    authentication : new OAuthAuthentication(AuthProvider.GOOGLE,'asdfds'),
    avatar : 'photo',
    country : 'india',
    firstName : 'admin',
    lastName : '123',
})

console.log('user',user);
console.log('admin',admin);