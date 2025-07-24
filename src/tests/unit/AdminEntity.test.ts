import { AdminUserEntity } from "@/domain/entities/Admin"
import { LocalAuthentication } from "@/domain/valueObjects/UserAuthentication"


describe('Admin entitiy creation',()=>{
    const adminUser = AdminUserEntity.create({
    username : 'coder',
     firstName : 'akash',
     lastName : 'ca',
     country : "ind",
     email : "akashanil@gmail.com",
     authentication : new LocalAuthentication('Akashanil'),
     avatar : 'picture'
})
expect('')
})