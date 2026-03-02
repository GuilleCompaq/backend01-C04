import { Router } from "express";

const router = Router ();

router.get('/', (req, res) => {
    res.render('home', {title:'Inicio'})
})

router.get('/chat', (req, res) => {
    res.render('chat', {title:'Entrar a Chat'})
})

export default router;