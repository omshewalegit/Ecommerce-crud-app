package org.example.ecommercespringmvc.repository;

import org.example.ecommercespringmvc.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product,Long> {

}
