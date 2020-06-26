import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { MdShoppingCart } from 'react-icons/md';

import { formatPrice } from '../../util/format';
import { Container, Cart, Dropdown } from './styles';

import logo from '../../assets/images/logo.svg';

function Header({ location }) {
  const cartSize = useSelector(state => state.cart.products.length);
  const cart = useSelector(state =>
    state.cart.products.slice(0, 3).map(product => ({
      ...product,
      price: formatPrice(product.price),
    }))
  );
  const total = useSelector(state =>
    state.cart.products.reduce((total1, product) => {
      return total1 + product.price * product.amount;
    }, 0)
  );

  return (
    <Container>
      <Link to="/">
        <img src={logo} alt="RocketShoes" width={350} />
      </Link>

      <Cart to="/cart">
        <strong>Carrinho</strong>

        <div>
          <MdShoppingCart size={36} color="#fff" />
          <span>{cartSize}</span>
        </div>

        {cart.length && location.pathname !== '/cart' ? (
          <Dropdown>
            {cart.map(product => (
              <div>
                <img src={product.image} alt={product.title} />
                <div>
                  {product.title}
                  <p>
                    {product.amount} x <span>{product.price}</span>
                  </p>
                </div>
              </div>
            ))}
            {cartSize > 3 && <div className="more">...</div>}
            <h2>
              <span>TOTAL:</span>
              <span>{total}</span>
            </h2>
          </Dropdown>
        ) : null}
      </Cart>
    </Container>
  );
}

export default withRouter(Header);
