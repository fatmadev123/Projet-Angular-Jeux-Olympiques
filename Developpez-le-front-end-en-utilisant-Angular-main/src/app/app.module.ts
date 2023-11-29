import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { DetailComponent } from './detail/detail.component';
import { RouterModule } from '@angular/router';
import { OlympicService } from './core/services/olympic.service';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NotFoundComponent,
    DetailComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgApexchartsModule,
    RouterModule,
  ],
  providers: [OlympicService],
  bootstrap: [AppComponent],
})
export class AppModule {}
