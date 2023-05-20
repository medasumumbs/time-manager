import { Component } from "react";
import { Navigate } from "react-router-dom";
import { add } from "./CRUD";

export default class TodoAdd extends Component {
    constructor(props){
        super(props);
        this.state = { redirect: false, title: '' };
        this.handleTitleChange=this.handleTitleChange.bind(this);
        this.handleDescChange=this.handleDescChange.bind(this);
        this.handleImageChange=this.handleImageChange.bind(this);
        this.handleFormSubmit=this.handleFormSubmit.bind(this);
        this.clearFormData();
    }

    clearFormData(){
        this.formData = {
            title: '',
            desc: '',
            image: ''
        };
    }
    
    resetErrorMessages(){
        this.setState( (state) => ({
            errorTitle:''
        }))
    }

    validate(){
        this.resetErrorMessages();
        if (!this.formData.title){
            this.setState( (state) => ({ errorTitle: 'Не указан заголовок дела'}))
            return false;
        }
        return true
    }

    handleTitleChange(evt){
        this.formData.title = evt.target.value;
    }

    handleDescChange(evt){
        this.formData.desc = evt.target.value;
    }

    handleImageChange(evt){
        const cFiles = evt.target.files;
        if (cFiles.length > 0) {
            const fileReader = new FileReader();
            const that = this;
            fileReader.onload = () => {
                that.formData.image = fileReader.result;
            }
            fileReader.readAsDataURL(cFiles[0]);
        } else {
            this.formData.image = '';
        }
    }

    async handleFormSubmit(evt){
        evt.preventDefault();
        if (!this.validate()) return;
        const newDeed = { ...this.formData };
        const date = new Date();
        newDeed.done = false;
        newDeed.createdAt = date.toLocaleString();
        const addedDeed = await add(this.props.currentUser, newDeed);
        this.props.add(addedDeed)
        this.setState((state)=>({ redirect: true }))
    }

    render(){
        if (!this.props.currentUser){
            return <Navigate to="/login" replace/>
        }
        if (this.state.redirect) {
            return <Navigate to="/"/>
        }
        return (
            <section>
                <h1>Создание нового дела</h1>
                <form onSubmit={this.handleFormSubmit}>
                    <div className="field">
                        <label className="label">Заголовок</label>
                        <div className="control">
                            <input 
                                className="input" 
                                onChange={this.handleTitleChange}
                            />
                        </div>
                    </div>
                    {this.state.errorTitle && <p className="help is-danger">{this.state.errorTitle}</p>}
                    <div className="field">
                        <label className="label">Примечание</label>
                        <div className="control">
                            <textarea 
                                className="textarea" 
                                onChange={this.handleDescChange}
                            />
                        </div>
                    </div>
                    <div className="field">
                        <div className="file">
                            <label className="file-label">
                                <input 
                                    hidden={true}
                                    className="file-imput"
                                    type="file" accept="image/*"
                                    onChange={this.handleImageChange}
                                />
                                <span className="file-cta">
                                    <span className="file-label">
                                        Графическая иллюстрация...
                                    </span>
                                </span>
                            </label>
                        </div>
                    </div>
                    <div className="field is-grouped is-grouped-right">
                        <div className="control">
                            <input
                                type="reset"
                                className="button is-link is-light"
                                value="Сброс"
                            />
                        </div>
                        <div className="control">
                            <input 
                                type="submit"
                                className="button is-primary"
                                value="Создать дело"
                            />
                        </div>
                    </div>
                </form>
            </section>
        )
    }
}