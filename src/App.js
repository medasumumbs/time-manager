import { Component } from "react";
import TodoList from './TodoList';
import TodoAdd from './TodoAdd';
import './redefine.css';
import { HashRouter, Routes, Route, NavLink } from "react-router-dom";
import TodoDetails from './TodoDetails'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Register from "./Register";
import Login from "./Login";
import Logout from "./Logout";
import firebaseApp from "./firebase";
import { deleteDeed, getList, setDone } from "./CRUD";

export default class App extends Component {
  constructor(props){
    super(props);
    this.state = { 
      data: [],
      currentUser: undefined
    };
    this.setDone = this.setDone.bind(this);
    this.delete = this.delete.bind(this);
    this.add = this.add.bind(this);
    this.showMenu = this.showMenu.bind(this);
    this.hideMenu = this.hideMenu.bind(this);
    this.getDeed = this.getDeed.bind(this);
    this.authStateChanged = this.authStateChanged.bind(this);
  }

  async authStateChanged(user){
    this.setState( (state) => ({ currentUser: user }) );
    if (user){
      const newData = await getList(user);
      this.setState( (state) => ({ data: newData }) );
    } else {
      this.setState( (state) => ({ data: [] }) );
    }
  }

  componentDidMount(){
    onAuthStateChanged(getAuth(firebaseApp), this.authStateChanged);
  }

  showMenu(evt){
    if (evt && evt.preventDefault) evt.preventDefault();
    this.setState( (state) => ({ showMenu: !state.showMenu }) );
  }

  hideMenu(evt){
    if (evt && evt.preventDefault) evt.preventDefault();
    this.setState( (state) => this.state.showMenu && ({ showMenu: !state.showMenu }) );
  }

  add(deed){
    this.state.data.push(deed);
    this.setState((state)=>({}))
  }

  getDeed(key){
    return this.state.data.find((current) => current.key === key)
  }

  async delete(key){
    await deleteDeed(this.state.currentUser, key);
    const newData = this.state.data.filter(
      (current) => current.key !== key
    );
    this.setState( (state) => ({ data: newData }) )
  }

  async setDone(key){
    await setDone(this.state.currentUser, key);
    const deed = this.state.data.find( (current) => current.key===key );
    if (deed) {
      deed.done=true;
      this.setState( (state) => ({}) );
    }
  }

  render() {
    return (
      <HashRouter>
        <nav className="navbar is-light">
          <div className="navbar-brand">
            <div className="navbar-shell navbar-item"
              onClick={this.hideMenu}>
              <NavLink
                to="/"
                className={( {isActive} ) => 
                  'navbar-item is-uppercase' + (isActive ? ' is-active' : '') 
                }
              >
                {this.state.currentUser ? this.state.currentUser.email+' - ' : ""}
                Список дел 
              </NavLink>
            </div>
            <a 
              href="/"
              className={ 
                          this.state.showMenu ? 
                          'navbar-burger is-active' : 
                          'navbar-burger'
                        }
              onClick={this.showMenu}
            >
              <span></span>
              <span></span>
              <span></span>
            </a>
          </div>
          <div 
            className={
              this.state.showMenu ? 
              'navbar-menu is-active' :
              'navbar-menu'
            }
            onClick={this.showMenu}
          >
            <div className="navbar-start">
              {
                this.state.currentUser && (
                  <NavLink
                  to="/add"
                  className={( {isActive} ) => 
                    'navbar-item ' + (isActive ? ' is-active' : '') 
                  }
                >
                  Создать дело
                </NavLink>
              )}
              {!this.state.currentUser && (
                <NavLink
                  to="/register"
                  className={ ({isActive}) => 'navbar-item ' + (isActive ? 'is-active' : '') }
                >
                  Зарегистрироваться
                </NavLink>
              )}
              {!this.state.currentUser && (
                <NavLink
                  to="/login"
                  className={ ({isActive}) => 'navbar-item ' + (isActive ? 'is-active' : '') }
                >
                  Войти
                </NavLink>
              )}
            </div>
            {this.state.currentUser && (
                <NavLink
                  to="/logout"
                  className={ ({isActive}) => 'navbar-item ' + (isActive ? 'is-active' : '') }
                >
                  Выйти
                </NavLink>
              )}
          </div>
        </nav>
        <main className="context px-6 mt-6">
          <Routes>
            <Route 
              path="/" 
              element={
                <TodoList list={this.state.data} 
                          setDone={this.setDone}
                          delete={this.delete}
                          currentUser={this.state.currentUser}
                />
              } 
            />
            <Route
              path="/add"
              element={<TodoAdd add={this.add} currentUser={this.state.currentUser}/>}
            />
            <Route
              path="/:key"
              element={<TodoDetails getDeed={this.getDeed} currentUser={this.state.currentUser}/>}
            />
            <Route
              path="/register"
              element={<Register currentUser={this.state.currentUser}/>}
            />
            <Route
              path="/login"
              element={<Login currentUser={this.state.currentUser}/>}
            />
            <Route
              path="/logout"
              element={<Logout currentUser={this.state.currentUser}/>}
            />
          </Routes>
        </main>
      </HashRouter>
    )
  }
};