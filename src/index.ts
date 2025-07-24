import { AdminUserEntity } from "./domain/entities/Admin";
import { LocalAuthentication } from "./domain/valueObjects/UserAuthentication";

const admin = AdminUserEntity.create({
    username : 'coder',
     firstName : 'akash',
     lastName : 'ca',
     country : "ind",
     email : "akashanil@gmail.com",
     authentication : new LocalAuthentication('Akashanil'),
     avatar : 'picture'
})

console.log(admin);