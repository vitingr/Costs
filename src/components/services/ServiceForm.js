import { useState } from 'react'

import Input from '../form/Input'
import Submit from '../form/Submit'

import styles from './ServiceForm.module.css'

function ServiceForm({ handleSubmit, btnText, projectData }) {

    const [service, setService] = useState({})


    function submit(e) {

        // ProjectData é o projeto atual que foi passado tipo na URL (props)
        e.preventDefault()
        projectData.services.push(service)
        handleSubmit(projectData)

    }

    function handleChange(e) {
        // Quando tá preenchendo o input o targetname vira algums do valores do input abaixo, quando alterar algo, vai formando objetos
        setService({...service, [e.target.name]: e.target.value})
    }

    return (
        <form onSubmit={submit} className={styles.form}>

            <Input type="text" text="Nome do Serviço" name="name" id="name" autoComplete='off' placeholder='Insira o nome do serviço' handleOnChange={handleChange} />

            <Input type="number" text="Custo do Serviço" name="cost" id="cost" placeholder='Insira o preço do serviço' handleOnChange={handleChange} />

            <Input type="text" text="Descrição do Serviço" name="description" id="description" autoComplete='off' placeholder='Descreva o serviço' handleOnChange={handleChange} />

            <Submit text={btnText} />
        </form>
    )
}

export default ServiceForm
