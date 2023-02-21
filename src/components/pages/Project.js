import Loader from '../layout/Loader'
import Container from '../layout/Container'
import Message from '../layout/Message'
import ProjectForm from '../project/ProjectForm'

import styles from './Project.module.css'

import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'

function Project() {

    // Use Params busca alguma informação dos paramêtros (URL)
    const { id } = useParams()
    console.log(id)

    const [project, setProject] = useState([])
    const [showProjectForm, setShowProjectForm] = useState(false)
    const [message, setMessage] = useState()
    const [type, setType] = useState()

    useEffect(() => {

        setTimeout(() => {
            fetch(`http://localhost:5000/projects/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((resp) => {

                resp.json().then((data) => {

                    setProject(data)

                })

            }).catch((erro) => {
                console.log(erro)
            })
        }, 500)

    }, [id])

    function editPost(project) {

        if (project.budget < project.cost) {
            setMessage("O orçamento não pode ser menor que o atual custo do Projeto!")
            setType("error")
            return false
        }

        fetch(`http://localhost:5000/projects/${project.id}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(project),
        }).then((resp) => {

            console.log(resp)
            resp.json().then((data) => {

                console.log(data)
                // Vai alterar o projeto do banco pelo atualizado (data)
                setProject(data)
                setShowProjectForm(!showProjectForm)
                setMessage("O Projeto foi Atualizado com Sucesso!")
                setType("success")

            })

        }).catch((erro) => {
            console.log(erro)
        })

    }

    function toggleProjectForm() {
        setShowProjectForm(!showProjectForm)
    }

    return (<>
        {project.name ? (
            <div className={styles.project_details}>
                <Container customClass='column'>
                    {message && <Message type={type} text={message} />}
                    <div className={styles.details_container}>
                        <h1>Projeto: {project.name}</h1>
                        <button className={styles.btn} onClick={toggleProjectForm}>
                            {!showProjectForm ? 'Editar Projeto' : 'Fechar Projeto'}
                        </button>
                        {!showProjectForm ? (
                            <div className={styles.project_info}>
                                <p>
                                    <span>Categoria:</span> {project.category.name}
                                </p>
                                <p>
                                    <span>Total de Orçamento:</span> R${project.budget}
                                </p>
                                <p>
                                    <span>Total Utilizado:</span> R${project.cost}
                                </p>
                            </div>
                        ) : (
                            <div className={styles.project_info}>
                                <ProjectForm handleSubmit={editPost} btnText="Concluir Edição" projectData={project} />
                            </div>
                        )}
                    </div>
                </Container>
            </div>
        ) : (
            <Loader />
        )}
    </>
    )
}

export default Project