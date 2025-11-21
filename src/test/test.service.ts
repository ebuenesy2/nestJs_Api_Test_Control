import { Injectable } from '@nestjs/common';

@Injectable()
export class TestService {
    
    async deneme(body){
        
        return {
            title:"deneme - test",
            body:body
        }
    }

}
