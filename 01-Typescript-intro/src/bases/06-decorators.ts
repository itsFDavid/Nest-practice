  const Deprecated = (deprecatedReasion: string) =>{
    return (target: any, memberName: string, propertyDescriptor: PropertyDescriptor) =>{
        console.log('Deprecated', target, memberName, propertyDescriptor);
        return {
            get(){
                const wrapperFn = (...args: any[]) =>{
                    console.warn(`The method ${memberName} is deprecated, ${deprecatedReasion}`);
                    return propertyDescriptor.value.apply(this, args);
                }
                return wrapperFn; 
            }
        }
    }
  }


export class Pokemon{
    constructor(
        public readonly id: number,
        public name: string,
    ){}

    scream(){
        return `${this.name.toUpperCase()}!!!`;
    }
    @Deprecated('Most use speak2 method instead')
    speak(){
        return `${this.name} ${this.id}`;
    }
}

export const charmander = new Pokemon(4, 'Charmander');
console.log(charmander.scream());
console.log(charmander.speak());