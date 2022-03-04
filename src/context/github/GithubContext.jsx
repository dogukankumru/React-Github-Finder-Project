import {createContext,useReducer} from "react";
import githubReducer from "./GithubReducer";

const GithubContext = createContext();

export const GithubProvider = ({children}) =>{
    
    const initialState ={
        users: [],
        loading: false,
        user:{},
        repos:[]
    }

    const  [state,dispatch] = useReducer(githubReducer,initialState)

    //Get search results
    const fetchData = async (text) =>{

        dispatch({type:"SET_LOADING"})

        const response = await fetch(`https://api.github.com/search/users?q=${text}`);
        const data = await response.json();
        const items = await data.items;

        dispatch({
            type:"GET_USERS",
            payload: items
        })
    }

    //Get single user
    const getUser = async (login) =>{

        dispatch({type:"SET_LOADING"})

        const response = await fetch(`https://api.github.com/users/${login}`);

        if(response.status===404){
            window.location = "/notfound"
        }

        else{
            const data = await response.json();
            dispatch({
                type:"GET_USER",
                payload: data
            })
        }
    }

    //Get User Repos
    const getUserRepos = async (login) =>{

        dispatch({type:"SET_LOADING"})

        const response = await fetch(`https://api.github.com/users/${login}/repos?sort=created&per_page=${10}`);
        const data = await response.json();

        dispatch({
            type:"GET_REPOS",
            payload: data
        })
    }

    //Clear Users
    const clearUsers=()=>dispatch({type:"CLEAR_USERS"})

    return <GithubContext.Provider value={{
        users: state.users,
        loading: state.loading,
        user:state.user,
        repos:state.repos,
        fetchData,
        clearUsers,
        getUser,
        getUserRepos
    }}>
        {children}
    </GithubContext.Provider>
}

export default GithubContext;