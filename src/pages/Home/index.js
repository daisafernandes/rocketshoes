import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MdAddShoppingCart } from 'react-icons/md';
import Loader from 'react-loader-spinner';
import { formatPrice } from '../../util/format';
import api from '../../services/api';

import * as CartActions from '../../store/modules/cart/actions';

import { ProductList, Loading } from './styles';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [didMount, setDidMount] = useState(false);

  const amount = useSelector(state =>
    state.cart.products.reduce((amount1, product) => {
      amount1[product.id] = product.amount;
      return amount1;
    }, {})
  );

  const addingIds = useSelector(state => state.cart.addingIds);

  const dispatch = useDispatch();

  useEffect(() => {
    async function loadProducts() {
      const response = await api.get('products');
      const data = response.data.map(product => ({
        ...product,
        priceFormatted: formatPrice(product.price),
      }));

      setTimeout(() => {
        setProducts(data);
        setLoading(false);

        setTimeout(() => {
          setDidMount(true);
        }, 0);
      }, 1000);
    }
    loadProducts();
  }, []);

  function handleAddProduct(id) {
    dispatch(CartActions.addToCartRequest(id));
  }

  if (loading) {
    return (
      <Loading>
        <Loader type="MutatingDot" color="#FFFFFF" />
      </Loading>
    );
  }
  return (
    <ProductList didMount={didMount ? 1 : 0}>
      {products.map(product => (
        <li key={product.id}>
          <img src={product.image} alt={product.title} />
          <strong>{product.title}</strong>
          <span>{product.priceFormatted}</span>

          <button
            type="button"
            onClick={() => handleAddProduct(product.id)}
            // disabled={addingIds.includes(product.id)}
          >
            <div>
              <MdAddShoppingCart size={16} color="#FFF" />{' '}
              {amount[product.id] || 0}
              {addingIds.includes(product.id) && (
                <div className="loading">
                  <Loader type="Oval" color="#FFF" width={18} height={18} />
                </div>
              )}
            </div>
            <span>ADICIONAR AO CARRINHO</span>
          </button>
        </li>
      ))}
    </ProductList>
  );
}

export default Home;
