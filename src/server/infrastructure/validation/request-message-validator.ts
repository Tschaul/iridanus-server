import { readFile } from 'fs'
import { injectable } from "inversify";
import { Initializer } from "../initialisation/initializer";
import { Validator } from "jsonschema";
import { RequestMessage } from '../../../shared/messages/request-message';

let schema: any;
let definitions: any;

@injectable()
export class RequestMessageValidator {

  private validator = new Validator();

  constructor(initializer: Initializer) {
    initializer.requestInitialization(this.initialize());
  }

  private initialize() {
    return new Promise<void>((resolve, reject) => {

      if (schema && definitions) {
        resolve(); 
        this.populateSchemata();
        return;
      }

      readFile('request-schema.json', 'utf-8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          try {

            const parsedData = JSON.parse(data, (key, value) => {
              const marker = '#/definitions';
              if (key === '$ref' && typeof value === "string" && value.startsWith(marker)) {
                return value.slice(marker.length)
              } else {
                return value;
              }
            });

            definitions = parsedData.definitions;
            schema = parsedData;
            delete parsedData.definitions;

            this.populateSchemata();

            resolve()
          } catch (error) {
            reject(error);
          }
        }
      })
    })
  }

  private populateSchemata() {
    Object.getOwnPropertyNames(definitions).forEach((key: string) => {
      this.validator.addSchema(definitions[key], `/${key}`);
    })
  }

  public assertRequestMessageValid(message: RequestMessage) {
    this.validator.validate(message, schema, {
      allowUnknownAttributes: false,
      throwError: true
    });
  }

}
