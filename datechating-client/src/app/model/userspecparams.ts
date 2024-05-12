import { User } from "./user";

export class Userspecparams{    
    pageSize = 8;
    pageIndex = 1;   
    gender : string;
    
    ageFrom = 18;
    ageTo = 100; 
    

    constructor(user : User){
        this.gender = user.gender === "female" ? "male" : "female";
    }
}