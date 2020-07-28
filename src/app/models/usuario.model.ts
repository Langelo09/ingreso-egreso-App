export class Usuario {

    static fromFirebase( { email, uid, nombre} ) {
        return new Usuario( uid, nombre, email);
    }

    // Forma corta de crear clases en TypeScript
    constructor(
        public uid: string,
        public nombre: string,
        public email: string
    ) {}

}

