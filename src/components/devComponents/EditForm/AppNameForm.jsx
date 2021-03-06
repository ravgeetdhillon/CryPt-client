import React,{useState,useRef} from 'react';
import {connect} from 'react-redux'
import {setAppName} from '../../../redux/project/project.actions'
import axios from 'axios'
import LinearProgress from '../../linearProgress'
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import Divider from '@material-ui/core/Divider'

function AppNameForm(props){

 const name = useRef('')
 const [flag,setflag] = useState(true)
 const [progress,setprogress] = useState(false)
 const [error,setError]  = useState({exist:0,message:''})
 const [mode,setmode] = useState('unedit')

 const changeAppName = ()=>{
     setprogress(true)
     axios.post('/client/editprojectname',{
         withCredentials:true,
         project_id:props.project_id,
         new_projectname:name.current.value
     }).then(res=>{
        setprogress(false)
        if(res.data.status === 500){
            setError({...error,exist:1,message:'server_error'})
        }else{
             setError({...error,exist:0,message:''})
             props.setAppName(res.data.name)
             setflag(!flag)
        }
     }).catch(err=>{
         setprogress(false);
         setError({...error,exist:1,message:'server_error'})})
 }

return (
    <div>
        <label className='h5 mb-4'>Application Name</label>
        {(progress)?<LinearProgress />:<></>}
        {(mode === 'unedit')?
        <div className="d-flex fm my-2 justify-content-between">
            <label className='my-auto'><b>{props.projectname}</b></label>
            <div className='d-flex justify-content-center'>
                <IconButton size='small' className='mr-2' disabled={progress} onClick={()=>setmode('edit')}>
                    <EditIcon fontSize='small'/>
                </IconButton>
            </div>
        </div>
        :
        <div className="d-flex fm my-2 justify-content-between">
            <input type="text" required className="form-control fm" key={(flag)?0:1} ref={name} id='appname' defaultValue={props.projectname} placeholder="Enter Application Name" />
            <div className='d-flex justify-content-center'>
                <IconButton size='small' className='mr-2' disabled={progress} onClick={changeAppName}>
                    <CheckIcon fontSize='small'/>
                </IconButton>
                <IconButton size='small' className='mr-2' disabled={progress} onClick={()=>setmode('unedit')}>
                    <ClearIcon fontSize='small'/>
                </IconButton>
            </div>
        </div>}
        <small>The name of your OAuth 2.0 client. This name is only used to identify the client in the console and will not be shown to end users.</small>   
        <Divider/>
    </div>
)
}

const mapStateToProps = state=>({
    projectname:state.project.projectname,
    project_id:state.project._id
})

const mapDispatchToProps = dispatch=>({
    setAppName:name=>dispatch(setAppName(name))
})

export default connect(mapStateToProps,mapDispatchToProps)(AppNameForm)