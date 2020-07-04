import { Pipe, PipeTransform } from "@angular/core";

@Pipe({name: "enumToOption"})
export class EnumToOptionPipe implements PipeTransform {

    transform<T>(data: T): Array<{label: string, value: number}> {

        const result = Object.values(data)
            .filter((value) => typeof value !== "number")
            .map((key: string) => {
                const label = key.toLowerCase();
                const value = data[key] as number;
                return {label, value};
            });

        return result;
    }
}
