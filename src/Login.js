import { Component } from "react";
import { Navigate } from "react-router-dom";
import { login } from "./auth";

export default class Register extends Component {
    constructor(props){
        super(props);
        this.state = {
            errorEmail:'',
            errorPassword:'',
        }
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.clearFormData();
    }

    clearFormData(){
        this.formData = {
            email: '',
            password: ''
        };
    }

    resetErrorMessages(){
        this.setState( (state) => ({
            errorEmail:'',
            errorPassword:'',
        }))
    }

    showDatabaseErrorMessage(code){
        this.resetErrorMessages();
        let errorText = 'Неизвестная ошибка регистрации. Пожалуйста, сообщите разработчику, сделав скриншот консоли браузера.'
        if (code.includes('auth/invalid-email')){
            errorText = "Введён некорректный адрес электронной почты.";
            this.setState( (state) => ({errorEmail: errorText}) );
        } else if (code.includes('missing-password')){
            errorText = "Введите пароль для авторизации.";
            this.setState( (state) => ({errorPassword: errorText}) );
        } else if (code.includes('user-not-found')){
            errorText = "Пользователь с указанными реквизитами доступа не зарегистрирован";
            this.setState( (state) => ({errorPassword: errorText}) );
        } else if (code.includes('wrong-password')){
            errorText = "Введен неверный пароль";
            this.setState( (state) => ({errorPassword: errorText}) );
        } else if (code.includes('too-many-requests')){
            errorText = "Количество попыток авторизации исчерпано. Попробуйте повторить вход через несколько минут";
            this.setState( (state) => ({errorPassword: errorText}) );
        } else {
            this.setState( (state) => ({errorPassword: errorText}) );
        }
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
        return true;
    }

    handleEmailChange(evt){
        this.formData.email=evt.target.value;
    }

    handlePasswordChange(evt){
        this.formData.password=evt.target.value;
    }

    async handleFormSubmit(evt){
        evt.preventDefault();
        if (!this.validate()) return
        const result = await login(this.formData.email, this.formData.password);
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
                <h1>Авторизация</h1>
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
                    <div className="field is-grouped is-grouped-right">
                        <div className="control">
                            <input type="reset" className="button is-link is-light" value="Сброс"/>
                        </div>
                        <div className="control">
                            <input type="submit" className="button is-primary" value="Войти"/>
                        </div>
                    </div>
                </form>
            </section>
        )
    }
}