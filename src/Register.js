import { Component } from "react";
import { Navigate } from "react-router-dom";
import { register } from "./auth";

export default class Register extends Component {
    constructor(props){
        super(props);
        this.state = {
            errorEmail:'',
            errorPassword:'',
            errorPasswordConfirm:''
        }
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handlePasswordConfirmChange = this.handlePasswordConfirmChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.clearFormData();
    }

    clearFormData(){
        this.formData = {
            email: '',
            password: '',
            passwordConfirm: '',
        };
    }

    resetErrorMessages(){
        this.setState( (state) => ({
            errorEmail:'',
            errorPassword:'',
            errorPasswordConfirm:''
        }))
    }

    validate(){
        this.resetErrorMessages();
        if (!this.formData.email){
            this.setState( (state) => ({ errorEmail:'Адрес электронной почты не указан' }) )
            return false;
        }
        if (!this.formData.password){
            this.setState( (state) => ({ errorPassword:'Пароль не указан' }) );
            return false;
        }
        if (!this.formData.passwordConfirm){
            this.setState( (state) => ({ errorPasswordConfirm:'Повтор пароля не указан' }) );
            return false;
        }
        if ( this.formData.passwordConfirm !== this.formData.password ){
            const errorText = 'Введённые пароли не совпадают';
            this.setState( (state) => ({ 
                errorPasswordConfirm: errorText,
                errorPassword: errorText
            }) );
            return false;
        }
        return true;
    }

    showDatabaseErrorMessage(code){
        this.resetErrorMessages();
        let errorText = 'Неизвестная ошибка регистрации. Пожалуйста, сообщите разработчику, сделав скриншот консоли браузера.'
        if (code==='auth/email-already-in-use'){
            errorText='Пользователь с таким адресом электронной почты уже зарегистрирован';
            this.setState( (state) => ({errorEmail: errorText}) );
        } else if (code.includes('auth/invalid-email')){
            errorText = "Введён некорректный адрес электронной почты.";
            this.setState( (state) => ({errorEmail: errorText}) );
        } else if (code.includes('missing-password')){
            errorText = "Введите пароль для регистрации.";
            this.setState( (state) => ({errorPassword: errorText}) );
        } else if (code.includes('weak-password')){
            errorText = "Слишком простой пароль. Хакеры будут знать обо всех ваших планах!";
            this.setState( (state) => ({errorPasswordConfirm: errorText}) );
        } else {
            this.setState( (state) => ({errorPassword: errorText}) );
        }
    }

    handleEmailChange(evt){
        this.formData.email=evt.target.value;
    }

    handlePasswordChange(evt){
        this.formData.password=evt.target.value;
    }

    handlePasswordConfirmChange(evt){
        this.formData.passwordConfirm=evt.target.value;
    }

    async handleFormSubmit(evt){
        evt.preventDefault();
        if (!this.validate()) return
        const result = await register(this.formData.email, this.formData.password);
        if (typeof result !== 'object') {
            this.showDatabaseErrorMessage(result);
            console.log(result);
        }
    }

    render(){
        if (this.props.currentUser) {
            return <Navigate to="/" replace/>
        }
        return(
            <section>
                <h1>Регистрация</h1>
                <form onSubmit={this.handleFormSubmit}>
                    <div className="field">
                        <label className="label">Адрес электронной почты</label>
                        <div className="control">
                            <input type="email" className="input" onChange={this.handleEmailChange} />
                        </div>
                    </div>
                    {this.state.errorEmail && <p className="help is-danger">{this.state.errorEmail}</p>}
                    <div className="field">
                        <label className="label">Пароль</label>
                        <div className="control">
                            <input type="password" className="input" onChange={this.handlePasswordChange} />
                        </div>
                    </div>
                    {this.state.errorPassword && <p className="help is-danger">{this.state.errorPassword}</p>}
                    <div className="field">
                        <label className="label">Подтверждение пароля</label>
                        <div className="control">
                            <input type="password" className="input" onChange={this.handlePasswordConfirmChange} />
                        </div>
                    </div>
                    {this.state.errorPasswordConfirm && <p className="help is-danger">{this.state.errorPasswordConfirm}</p>}
                    <div className="field is-grouped is-grouped-right">
                        <div className="control">
                            <input type="reset" className="button is-link is-light" value="Сброс"/>
                        </div>
                        <div className="control">
                            <input type="submit" className="button is-primary" value="Зарегистрироваться"/>
                        </div>
                    </div>
                </form>
            </section>
        )
    }
}