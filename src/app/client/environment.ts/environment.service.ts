import { SocketConnection } from "../socket-connection";
import { injectable } from "inversify";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { EnvironmentInfoSubscription } from "../../../shared/messages/subscriptions/environment-subscriptions";
import { EnvironmentInfoSubscriptionResult } from "../../../shared/messages/subscriptions/environment-subscription-results";

@injectable()
export class EnvironmentService {

  constructor(
    private connection: SocketConnection
    ) {}
  
  getEnvironmentInfo() {
    return  this.connection.subscribe<EnvironmentInfoSubscription, EnvironmentInfoSubscriptionResult>({
      type: 'ENVIRONMENT/INFO'
    }).pipe(
      map(result => result.info)
    )
  }

}