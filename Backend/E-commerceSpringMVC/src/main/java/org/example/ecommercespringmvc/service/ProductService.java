package org.example.ecommercespringmvc.service;

import org.example.ecommercespringmvc.model.Product;
import org.example.ecommercespringmvc.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    private ProductRepository productRepository;
    public ProductService(ProductRepository productRepository){
        this.productRepository = productRepository;
    }
    public void addProduct(Product product){
        productRepository.save(product);
    }
    public List<Product> getAllProducts(){
        return productRepository.findAll();
    }
    public Product getProductById(Long id){
        return productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }
    public void updateProduct(Product product){
        productRepository.save(product);
    }
    public void deleteProductById(Long id){
        if(!productRepository.existsById(id)){
            throw new RuntimeException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }
}
