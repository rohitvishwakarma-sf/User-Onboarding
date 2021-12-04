import { Observable, of } from 'rxjs';
import {
  LoadStateCommand,
  SaveStateCommand,
  LoadStateParameters,
  SaveStateParameters,
  TourState,
  SaveTourCommand,
  LoadTourCommand,
  SaveTourParameters,
  LoadTourParameters,
  Tour,
} from '@sourceloop/user-onboarding-client';
import { StorageService } from 'ngx-webstorage-service';

export class SaveTCommandCustom implements SaveTourCommand {
  constructor(private readonly storage: StorageService) {}
  public parameters!: SaveTourParameters;
  execute(): Observable<Tour> {
    const newTour: Tour = {
      tourId: this.parameters.tourId,
      tourSteps: this.parameters.tourSteps,
      styleSheet: this.parameters.styleSheet,
    };
    this.storage.set(this.parameters.tourId, newTour);
    return of(newTour);
  }
}

export class LoadTCommandCustom implements LoadTourCommand {
  constructor(private readonly storage: StorageService) {}
  public parameters!: LoadTourParameters;
  execute(): Observable<Tour> {
    const existingTour = this.storage.get(this.parameters.tourId);
    return of(existingTour);
  }
}

export class SaveSCommandCustom implements SaveStateCommand {
  constructor(private readonly storage: StorageService) {}
  public parameters!: SaveStateParameters;
  execute(): Observable<TourState> {
    const newTourState = this.parameters.state;
    this.storage.set(newTourState.sessionId, newTourState);
    return of(newTourState);
  }
}
export class LoadSCommandCustom implements LoadStateCommand {
  constructor(private readonly storage: StorageService) {}
  public parameters!: LoadStateParameters;
  execute(): Observable<TourState> {
    const currentState = this.storage.get(this.parameters.sessionId);
    return of(currentState);
  }
}
