const express = require("express");
const server = express();
const PORT = 3000;

const fs = require('fs');
const path = require('path');

server.use(express.json());

server.get("/home", (req, res) => {
  res.status(200).json("Bienvenido");
});
// Array products --------------------------------------------------------

//Lista de producto
server.get("/products", (req, res) => {
  try {
    // Leer el archivo products.json
    const productsPath = path.join(__dirname, 'products.json');
    const productsData = fs.readFileSync(productsPath, 'utf-8');
    const products = JSON.parse(productsData);
    
    res.status(200).json({
      title: "lista",
      products: products,
      total_products: products.length,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al leer el archivo de productos",
      message: error.message
    });
  }
});
//Producto x id ---------------------------------------------------------
server.get("/products/:id", (req, res) => {
  try {
    // Leer el archivo products.json de forma síncrona
    const productsPath = path.join(__dirname, 'products.json');
    const productsData = fs.readFileSync(productsPath, 'utf-8');
    const products = JSON.parse(productsData);
    
    const id = parseInt(req.params.id);
    console.log("id consultado", id);
    
    const prod = products.find((p) => p.id === id);
    console.log("prod", prod);

    if (!prod) {
      return res.status(404).json({ error: "Producto NO encontrado" });
    }

    console.log("Producto encontrado", prod);
    res.status(200).json(prod);
    
  } catch (error) {
    res.status(500).json({
      error: "Error al leer el archivo de productos",
      message: error.message
    });
  }
});
// POST add produts---------------------------------------------------
server.post("/products", (req, res) => {
  try {
    // Leer el archivo products.json de forma síncrona
    const productsPath = path.join(__dirname, 'products.json');
    const productsData = fs.readFileSync(productsPath, 'utf-8');
    const products = JSON.parse(productsData);
    
    const { marca, modelo } = req.body;
    console.log(marca, modelo);
    
    const nuevo = {
      id: products.length ? products[products.length - 1].id + 1 : 1,
      marca,
      modelo,
    };
    
    products.push(nuevo);
    
    // Guardar los cambios en el archivo
    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), 'utf-8');
    
    res.status(201).json({ message: "Producto creado", products: nuevo });
    
  } catch (error) {
    res.status(500).json({
      error: "Error al crear el producto",
      message: error.message
    });
  }
});
//PUT editar products--------------------------------------------------
server.put("/products/:id", (req, res) => {
  try {
    // Leer el archivo products.json de forma síncrona
    const productsPath = path.join(__dirname, 'products.json');
    const productsData = fs.readFileSync(productsPath, 'utf-8');
    const products = JSON.parse(productsData);
    
    const id = parseInt(req.params.id);
    const { marca, modelo } = req.body;
    console.log("id actualizar", id);
    
    const prod = products.find(p => p.id === id);
    console.log(prod);

    if (!prod) {
      return res.status(404).json({ error: "Producto NO encontrado" });
    }
    
    prod.marca = marca ?? prod.marca;
    prod.modelo = modelo ?? prod.modelo;

    // Guardar los cambios en el archivo
    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), 'utf-8');

    res.status(200).json({ message: "Producto actualizado", products: products });
    
  } catch (error) {
    res.status(500).json({
      error: "Error al actualizar el producto",
      message: error.message
    });
  }
});

//DELETE-----------------------------------------------------------------
server.delete("/products/:id", (req, res) => {
  try {
    // Leer el archivo products.json de forma síncrona
    const productsPath = path.join(__dirname, 'products.json');
    const productsData = fs.readFileSync(productsPath, 'utf-8');
    let products = JSON.parse(productsData);
    
    const id = parseInt(req.params.id);
    const prod = products.find(p => p.id === id);
    console.log(prod);
    
    if (!prod) {
      return res.status(404).json({ error: "Producto NO encontrado" });
    }
    
    products = products.filter(p => p.id !== id);
    console.log("id filtrado", id);
    
    // Guardar los cambios en el archivo
    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), 'utf-8');
    
    res.status(204).send();
    
  } catch (error) {
    res.status(500).json({
      error: "Error al eliminar el producto",
      message: error.message
    });
  }
});
//Server running
server.listen(PORT, () => console.log(`Escuchando localhost:${PORT}`));
 