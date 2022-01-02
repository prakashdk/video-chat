
package com.example.controller;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MainController{
    
    @RequestMapping("/path/{path}")
    public String welcome(@PathVariable("path") String path) {
        return path;
    }
}