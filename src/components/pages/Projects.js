import { useLocation } from "react-router-dom"
import { useState, useEffect } from "react"

import Message from "../layout/Message"
import Container from "../layout/Container"
import LinkButton from "../layout/LinkButton"
import ProjectCard from "../project/ProjectCard"
import Loader from "../layout/Loader"

import styles from './Projects.module.css'

function Projects() {

    const [projects, setProjects] = useState([])
    const [removeLoading, setRemoveLoading] = useState(false)
    const [projectMessage, setProjectMessage] = useState('')


    const location = useLocation()
    let message = ''

    if (location.state) {
        message = location.state.message
    }

    useEffect(() => {

        setTimeout(() => {
            fetch('http://localhost:5000/projects', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((resp) => {

                resp.json().then((data) => {

                    // Vai preencher o setProjects pelo dados da API
                    setProjects(data)
                    setRemoveLoading(true)

                }).catch((erro) => {

                    console.log(erro)

                })
            })
        }, 300)
    }, [])

    function removeProject(id) {
        fetch(`http://localhost:5000/projects/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((resp) => {

            resp.json().then(() => {

                setProjects(projects.filter((project) => project.id !== id))
                setProjectMessage('Projeto Removido com Sucesso!')

            }).catch((erro) => {
                console.log(`ERRO, ${erro}`)
            })

        }).catch((erro) => {
            console.log(`ERRO, ${erro}`)
        })
    }

    return (
        <div className={styles.project_container}>
            <div className={styles.title_container}>
                <h1>Meus Projetos</h1>
                <LinkButton to="/newproject" text="Criar Projeto" />
            </div>
            <div className={styles.desc_projeto}>
                <p>Aqui você pode ter acesso às informações exclusivas de seus projetos, entre elas, o Budget, Tipo de Projeto, Categoria e outras Diversas Informações!</p>
            </div>
            {message && <Message type="success" text={message} />}
            {projectMessage && <Message type="success" text={projectMessage} />}
            <Container customClasse="start">
                {projects.length > 0 &&
                    projects.map((project) => (
                        <ProjectCard name={project.name} id={project.id} budget={project.budget} category={project.category.name} key={project.id} handleRemove={removeProject} />
                    ))}
                {!removeLoading && <Loader />}
                {removeLoading && projects.length === 0 &&
                    <p>Não Há Projetos Cadastrados...</p>
                }
            </Container>
        </div>
    )
}

export default Projects
