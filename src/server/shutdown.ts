import { ContainerRegistry } from "./container-registry";
import { DataHandleRegistry } from "./repositories/data-handle-registry";
import { debounceTime, filter, first } from "rxjs/operators";
import { Server } from "http";

export function shutdown(server: Server, containerRegistry: ContainerRegistry) {

  console.log('SHUTDOWN: shutting down')
  server.close(() => {
    console.log('SHUTDOWN: Http server closed.');

    const dataHandleRegistry = containerRegistry.globalContainer.get(DataHandleRegistry);
  
    dataHandleRegistry.dataHandlesAreBusy$.pipe(debounceTime(0), filter(it => !it), first()).subscribe(() => {
      console.log('SHUTDOWN: data handles are idle. exiting')
      process.exit(0);
    })
  });
}