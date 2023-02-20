// Import Hooks

import { useEffect, useState } from 'react'

// Import Components

import Input from '../form/Input'
import Select from '../form/Select'
import Submit from '../form/Submit'

// Import Styles

import styles from './ProjectForm.module.css'

// Main Component

function ProjectForm({ handleSubmit, btnText, projectData }) {

    const [categories, setCategories] = useState([])
    const [project, setProject] = useState(projectData || []) // vai preencher no project data ou no objeto vazio, digitando nos inputs

    useEffect(() => {

        // Request com Fetch API
        fetch("http://localhost:5000/categories", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((resp) => {

            // Pegou os dados da resposta e transformou em JSON
            resp.json().then((data) => {

                // Setou as categorias com o valor de Data (Categorias em JSON)
                setCategories(data)
            })

        }).catch((erro) => {
            console.log(erro)
        })

    }, [])

    const submit = (e) => {
        e.preventDefault()
        handleSubmit(project)
    }

    function handleChange(e) {
        setProject({ ...project, [e.target.name]: e.target.value })
    }

    function handleCategory(e) {
        setProject({ ...project, category: {

            // Usando um noSQL, inserindo um objeto dentro do objeto. Pegando o ID do objeto e tipo pegando as info dele e copiando
            id: e.target.value,
            name: e.target.options[e.target.selectedIndex].text,
        }})
    }

    return (
        <form onSubmit={submit} className={styles.form}>
            <div>
                <Input type="text" text="Nome do Projeto" name="name" placeholder="Insira o Nome do Projeto" handleOnChange={handleChange} value={project.name ? project.name: ''} />
            </div>

            <div>
                <Input type="number" text="Orçamento do Projeto" name="budget" placeholder="Insira o Orçamento Total" handleOnChange={handleChange} value={project.budget ? project.budget: ''} />
            </div>

            <div>
                <Select name="category_id" text="Selecione a Categoria" options={categories} handleOnChange={handleCategory} value={project.category ? project.category.id: ''} />
            </div>

            <div>
                <Submit text={btnText} />
            </div>
        </form>
    )
}

export default ProjectForm
