import {
    Controller,
    Get
  } from '@nestjs/common';


@Controller("/code")
  export class AppController{

     @Get("")
     get(){
       return "Code Inbound LLP"
     }
}