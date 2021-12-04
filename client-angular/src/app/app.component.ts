import { Component, OnInit } from '@angular/core';
import { ROLE, User } from './user.model';
import { UsersService } from './users/users.service';
import {
  Tour,
  TourServiceService,
  TourStep,
  TourStoreServiceService,
} from '@sourceloop/user-onboarding-client';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { ReplaySubject } from 'rxjs';
import { prefix, suffix } from '@sourceloop/user-onboarding-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [TourServiceService, TourStoreServiceService],
})
export class AppComponent implements OnInit {
  title = 'client-angular';
  loading = false;
  btnText = 'Load';
  users: User[] = [];
  tourId = '1';

  // sampleTour = [
  sampleTour: TourStep[] = [
    {
      title: 'Step 1',
      id: '1',
      prevStepId: '',
      nextStepId: '2',
      text: 'Hello this is my first tour step',
      attachTo: {
        element: '#firsttour',
        on: 'bottom',
        type: 'string',
      },
      buttons: [
        {
          text: 'Back',
          key: 'prevAction',
          action: () => {
            console.log('prevbutton clicked');
          },
        },
        {
          text: 'Next',
          key: 'nextAction',
          action: () => {
            console.log('Next button clicked');
          },
        },
      ],
      currentRoute: '/',
      nextRoute: '/',
    },
    {
      title: 'Logout Button',
      id: '2',
      prevStepId: '1',
      nextStepId: '3',
      text: 'Click on this button to log out from the world',
      // text: `${prefix} https://www.youtube.com/watch?v=oSAi10QQyoI&ab_channel=DesignCourse ${suffix}`,

      attachTo: {
        element: '#logoutbutton',
        on: 'bottom',
        type: 'string',
      },
      buttons: [
        {
          text: 'Back',
          key: 'prevAction',
          action: () => {
            console.log('back back');
          },
          classes: 'sourceloop-btn-class1',
        },
        {
          text: 'Next',
          key: 'nextAction',
          action: () => {
            console.log('next next');
          },
        },
        {
          text: 'Extra Buttion',
          key: '',
          action: () => {
            console.log('extra button');
          },
        },
      ],
      currentRoute: '/',
      nextRoute: '/users',
      prevRoute: '/',
    },
    {
      title: 'Edit',
      id: '3',
      prevStepId: '2',
      nextStepId: '',
      text: 'Edit user from here',
      attachTo: {
        element: '#thirdtour',
        on: 'bottom',
        type: 'string',
      },
      buttons: [
        {
          text: 'Back',
          key: 'prevAction',
          action: () => {
            console.log('back back');
          },
        },
        {
          text: 'Next',
          key: 'nextAction',
          action: () => {
            console.log('next next');
          },
        },
        {
          text: 'Extra Buttion',
          key: '',
          action: () => {
            console.log('extra button');
          },
        },
      ],
      currentRoute: '/users',
      prevRoute: '/',
    },
  ];

  tourSubject!: ReplaySubject<Tour>;

  constructor(
    private usersService: UsersService,
    private tourService: TourServiceService,
    private tourStoreService: TourStoreServiceService
  ) {}
  ngOnInit() {
    this.usersService.usersChanged.subscribe((user) => {
      this.users = user;
    });
    // this.tourStoreService.
    // localStorage.clear();
    let tourSubject = new ReplaySubject<Tour>();
    this.tourStoreService
      .loadTour({ tourId: this.tourId })
      .subscribe((existingTour) => {
        if (!existingTour) {
          this.tourStoreService
            .saveTour({
              tourId: this.tourId,
              tourSteps: this.sampleTour,
              styleSheet: '',
            })
            .subscribe((newTour) => {
              tourSubject.next(newTour);
            });
        } else {
          tourSubject.next(existingTour);
        }
      });
    tourSubject.subscribe((tour) => {
      this.tourStoreService.registerFnRef('nextAction', () => {
        // this.cancel();
        this.next();
        // tour.tourSteps.
      });
    });
    tourSubject.subscribe((tour) => {
      this.tourStoreService.registerFnRef('prevAction', () => {
        this.cancel();
        this.back();
      });
    });
    this.tourService.run(this.tourId);
  }
  back() {
    console.log('back');
  }
  cancel() {
    console.log('cancel');
  }
  next() {
    console.log('next');
    this.tourSubject.next();
  }

  async btnLoadClick() {
    this.loading = true;
    this.btnText = 'Loading...';
    this.users = await this.usersService.getAll();
    this.loading = false;
    this.btnText = 'Refresh';
  }
  async clearstorage() {
    localStorage.clear();
  }
}
