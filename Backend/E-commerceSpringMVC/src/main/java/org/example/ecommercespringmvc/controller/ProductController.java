package org.example.ecommercespringmvc.controller;

import org.example.ecommercespringmvc.model.Product;
import org.example.ecommercespringmvc.service.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService){
        this.productService = productService;
    }

    @GetMapping("/home")
    public String greet(){
        return "Welcome to our E-commerce Platform!";
    }

    @GetMapping("/products")
    public List<Product> getAllProducts(){
        return productService.getAllProducts();
    }

    @GetMapping("/products/{id}")
    public Product getProduct(@PathVariable Long id){
        return productService.getProductById(id);
    }

    @PostMapping("/product")
    public void addProduct(@RequestBody Product product){
         productService.addProduct(product);
    }
    @PutMapping("/product")
    public void updateProduct(@RequestBody Product product){
        productService.updateProduct(product);
    }

    @DeleteMapping("/products/{id}")
    public void deleteProduct(@PathVariable Long id){
        productService.deleteProductById(id);
    }
}