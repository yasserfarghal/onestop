import React from 'react'
import ProductCard from './ProductCard'



function ProductList(props) {
  const {data} = props;
  if(!data){
    return alert("maesh data")
  }
  return (
    <>
      {data.map((item) => (
        <ProductCard key={item.id} data={item} />
         
      ))}
    </>
  );
}

export default ProductList
