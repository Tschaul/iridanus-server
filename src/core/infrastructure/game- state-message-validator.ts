import { readFile } from 'fs'
import { injectable } from "inversify";
import { Validator } from "jsonschema";
import { GameState } from '../../shared/model/v1/state';

let schema: any;
let definitions: any;

@injectable()
export class GameStateValidator {

  private validator = new Validator();

  constructor() {
  }

  public initialize() {
    return new Promise<void>((resolve, reject) => {

      if (schema && definitions) {
        resolve(); 
        this.populateSchemata();
        return;
      }

      readFile('state-schema.json', 'utf-8', (err, data) => {
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

  public assertGameStateValid(state: GameState) {
    this.validator.validate(state, schema, {
      allowUnknownAttributes: false,
      throwError: true,
    });
  }

}
