import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader-spinner';
import { bindActionCreators } from 'redux';
import { MdAddShoppingCart } from 'react-icons/md';

import api from '../../services/api';

import { ProductList, Loading } from './styles';
import { formatPrice } from '../../util/format';

import * as CartActions from '../../store/modules/cart/actions';

class Home extends Component {
  state = {
    products: [],
    loading: true,
    didMount: false,
  };

  async componentDidMount() {
    const response = await api.get('products');

    const data = response.data.map(product => ({
      ...product,
      priceFormatted: formatPrice(product.price),
    }));

    setTimeout(() => {
      this.setState({ products: data, loading: false });

      setTimeout(() => {
        this.setState({ didMount: true });
      }, 0);
    }, 1000);
  }

  handleAddProduct = id => {
    const { addToCartRequest } = this.props;

    addToCartRequest(id);
  }

  render() {
    const { products, loading, didMount } = this.state;
    const { amount } = this.props;

    if (loading) {
      return (
        <Loading>
          <Loader type="Oval" color="#FFFFFF" />
        </Loading>
      );
    }

    return (
      <ProductList didMount={didMount ? 1 : 0}>
        {products.map(product => (
          <li key={product.id}>
            <img src={product.image} alt={product.title}/>
            <strong>{product.title}</strong>
            <span>{product.priceFormatted}</span>

            <button type="button"
              onClick={() => this.handleAddProduct(product.id)}>
              <div>
                <MdAddShoppingCart size={16} color="#FFF" />{amount[product.id] || 0}
             </div>
              <span>ADICIONAR AO CARRINHO</span>
            </button>
          </li>
        ))}
      </ProductList>
    );
  }
}

const mapStateToProps = state => ({
  amount: state.cart.reduce((amount, product) => {
    amount[product.id] = product.amount;

    return amount;
  }, {}),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(CartActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Home);

