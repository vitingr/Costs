import { useNavigate } from 'react-router-dom'
import ProjectForm from '../project/ProjectForm'
import styles from './NewProject.module.css'

function NewProject() {

    const history = useNavigate()

    function createPost(project) {

        // Initialize cost and services
        project.cost = 0
        project.services = []

        fetch("http://localhost:5000/projects", {
            method: "POST",
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(project),
        }).then((res) => {

            res.json().then((data) => {

                console.log(data)

                // Redirect
                history('/projects', {state: {message: 'Projeto Criado com Sucesso!'}})

            }).catch((erro) => {

                console.log(erro)

            })

        }).catch((erro) => {

            console.log(erro)

        })
    }

    return (
        <div className={styles.newproject_container}>
            <h1>Criar Projeto</h1>
            <p>Crie o seu projeto para depois adicionar os serviços.</p>
            <ProjectForm handleSubmit={createPost} btnText="Criar Projeto" />
        </div>
    )
}

export default NewProject
