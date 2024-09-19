import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BarcodeGeneratorComponent } from './barcode-generator/barcode-generator.component'
import { QrcodeGeneratorComponent } from './qrcode-generator/qrcode-generator.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { LoginAuthGuard } from './login-auth.guard';
import { BarcodeDecoderComponent } from './barcode-decoder/barcode-decoder.component';
import { QrcodeDecoderComponent } from './qrcode-decoder/qrcode-decoder.component';

const routes: Routes = [
  {path:'',redirectTo:'/login',pathMatch:'full'},
  {path:'login', component:LoginComponent},
  {path:'home',component:HomeComponent, canActivate: [LoginAuthGuard] },
  {path:'barcode',component:BarcodeGeneratorComponent, canActivate: [LoginAuthGuard]},
  {path:'qrcode',component:QrcodeGeneratorComponent, canActivate: [LoginAuthGuard]},
  {path:'barcode-decode',component:BarcodeDecoderComponent, canActivate: [LoginAuthGuard]},
  {path:'qrcode-decode',component:QrcodeDecoderComponent, canActivate: [LoginAuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
