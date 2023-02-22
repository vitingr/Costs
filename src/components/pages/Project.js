import Loader from '../layout/Loader'
import Container from '../layout/Container'
import Message from '../layout/Message'
import ProjectForm from '../project/ProjectForm'
import ServiceForm from '../services/ServiceForm'
import ServiceCard from '../services/ServiceCard'

import styles from './Project.module.css'

import { parse, v4 as uuidv4 } from 'uuid'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'

function Project() {

    // Use Params busca alguma informação dos paramêtros (URL)
    const { id } = useParams()

    // States para exibir no projeto
    const [project, setProject] = useState([])
    const [services, setServices] = useState([])
    const [showProjectForm, setShowProjectForm] = useState(false)
    const [showServiceForm, setShowServiceForm] = useState(false)
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
                    setServices(data.services)

                })

            }).catch((erro) => {
                console.log(erro)
            })
        }, 500)

    }, [id])

    function editPost(project) {

        setMessage('')

        if (project.budget < project.cost) {
            setMessage("O orçamento não pode ser menor que o atual custo do Projeto!")
            setType("error")
            return false
        }

        if (project.budget < 0) {
            setMessage("O orçamento não pode ser um valor negativo!")
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

    // O create vai ser um update adicionado serviços

    function createService(project) {

        setMessage('')

        // Ultimo Serviço
        const lastService = project.services[project.services.length - 1]
        lastService.id = uuidv4()

        const lastServiceCost = lastService.cost
        const newCost = parseFloat(project.cost) + parseFloat(lastServiceCost)

        // Validação do Valor Máximo
        if (newCost > parseFloat(project.budget)) {
            setMessage('Orçamento ultrapassado, verifique o valor do serviço!')
            setType('error')
            project.services.pop()
            return false
        }

        // Adicionar custo do serviço ao custo total do projeto
        if (newCost <= parseFloat(project.budget)) {
            project.cost = newCost
            setMessage('SUCESSO! O serviço foi adicionado ao Projeto...')
            setType('success')
        }

        // Atualizar Projeto
        fetch(`http://localhost:5000/projects/${project.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(project)
        }).then((resp) => {

            resp.json().then((data) => {

                setShowServiceForm(false)

            }).catch((erro) => {
                console.log(erro)
            })

        }).catch((erro) => {
            console.log(erro)
        })

    }

    function removeService(id, cost) {

        setMessage('')
        
        const servicesUpdated = project.services.filter((service) => (
            service.id !== id
        ))

        const projectUpdated = project
        projectUpdated.services = servicesUpdated
        projectUpdated.cost = parseFloat(projectUpdated.cost) - parseFloat(cost)

        fetch(`http://localhost:5000/projects/${project.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(projectUpdated)
        }).then((resp) => {

            resp.json().then((data) => {

                setProject(projectUpdated)
                setServices(servicesUpdated)
                setMessage('Serviço Removido com Sucesso!')
                setType('success')

            }).catch((erro) => {
                console.log(erro)
            })

        }).catch((erro) => {
            console.log(erro)
        })


    }

    // Funções de DOM

    function toggleProjectForm() {
        setShowProjectForm(!showProjectForm)
    }

    function toggleServiceForm() {
        setShowServiceForm(!showServiceForm)
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
                    <div className={styles.service_form_container}>
                        <h2>Adicione um serviço:</h2>
                        <button className={styles.btn} onClick={toggleServiceForm}>
                            {!showServiceForm ? 'Adicionar Serviço' : 'Fechar'}
                        </button>
                        <div className={styles.project_info}>
                            {showServiceForm && (
                                <ServiceForm handleSubmit={createService} btnText="Adicionar Serviço" projectData={project} />
                            )}
                        </div>
                    </div>
                    <h2>Serviços</h2>
                    <Container customClass="start">
                        {services.length > 0 &&
                            services.map((service) => (

                                <ServiceCard id={service.id} name={service.name} cost={service.cost} description={service.description} key={service.id} handleRemove={removeService} />

                            ))
                        }
                        {services.length === 0 &&
                            <p>
                                Não há serviços cadastrados...
                            </p>
                        }
                    </Container>
                </Container>
            </div>
        ) : (
            <Loader />
        )}
    </>
    )
}

export default Project