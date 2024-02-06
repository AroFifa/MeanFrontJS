export const signIn_Fr = () => {
    return JSON.stringify({
        title: "Se connecter",
        notAccount: "Vous n'avez pas de compte ?",
        signUp: "S'inscrire",
        form: {
            label: {
                email: "Addresse E-mail",
                password: "Mot de passe",
            },
            errorLabel: {
                emailRequired: "L'adresse e-mail est requise",
                invalidEmail: "Veuillez saisir une adresse e-mail valide",
                passwordRequired: "Le mot de passe est requis",
                emailNotVerified:
                    "Votre compte n'est pas vérifié ! Vérifiez votre boîte mail pour la validation.",
            },
        },
    });
};

export const signIn_En = () => {
    return JSON.stringify({
        title: "Sign-in",
        notAccount: "You do not have an account ?",
        signUp: "Sign-up",
        form: {
            label: {
                email: "E-mail address",
                password: "Password",
            },
            errorLabel: {
                emailRequired: "E-mail address is required",
                invalidEmail: "Please enter a valid e-mail address",
                passwordRequired: "Password is required",
                emailNotVerified:
                    "Your account has not been verified! Check your mailbox for validation",
            },
        },
    });
};
