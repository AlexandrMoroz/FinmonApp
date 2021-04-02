// import { Component, OnInit } from '@angular/core';
// import { CheakFormService} from '../services/cheak-form.service'
// import { FlashMessagesService} from 'angular2-flash-messages'
// import { Router} from '@angular/router'
// import { AuthService } from '../services/auth.service';

// @Component({
//   selector: 'app-auth',
//   templateUrl: './auth.component.html',
//   styleUrls: ['./auth.component.scss']
// })
// export class AuthComponent implements OnInit {

//   login:string;
//   password:string;

//   constructor( 
//     private checkFrom: CheakFormService,
//     private flashMessages:FlashMessagesService,
//     private router: Router,
//     private authService: AuthService
//     ) { }

//   ngOnInit(): void {
//   }
//   userLoginClick(){
//     const user={
//       username:this.login,
//       password:this.password
//     }
//     this.authService.login(user).subscribe(
//       (data: any) => {
//         if(!data.success){
//           console.log(123)
//           this.flashMessages.show(data.message,{
//             cssClass:"alert-danger",
//             timeout:2000
//           });
        
//         }else{
//           this.flashMessages.show(data.message,{
//             cssClass:"alert-success",
//             timeout:2000
//           });
//           this.router.navigate(['/home']);
//           this.authService.storeUser(data.token,data.username)
//         }},
//         error => {
//           this.flashMessages.show(error.error.message,{
//             cssClass:"alert-danger",
//             timeout:4000
//           });
//           console.log(error)
//         }

//       );
//   }
// }
