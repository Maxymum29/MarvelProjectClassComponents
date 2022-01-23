import React from 'react';
import { Component } from 'react';
import PropTypes from 'prop-types';

import MarvelServices from '../../services/MarvelServices';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

import './charList.scss';

class CharList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            characters: [],
            loading: true,
            errorLoad: false,
            newItemLoading: false,
            offset: 210,
            charEnded: false,
        };
    }
    marvelCharacters = new MarvelServices();

    updateCharacters = (offset) => {
        this.onCharListLoading();
        this.marvelCharacters
            .getAllCharacters(offset)
            .then(this.onLoadedCharacters)
            .catch(this.onError);
    };

    onLoadedCharacters = (res) => {
        let ended = false;

        if (res.length < 9) {
            ended = true;
        }

        this.setState(({ offset, characters }) => ({
            characters: [...characters, ...res],
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended,
        }));
    };

    onError = () => {
        this.setState({ loading: false, errorLoad: true });
    };

    onCharListLoading = () => {
        this.setState({ newItemLoading: true });
    };

    onScroll = () => {
        if (this.state.offset < 219) return;
        if (this.state.newItemLoading) return;
        if (this.state.charEnded) return;
        if (
            window.pageYOffset + document.documentElement.clientHeight >=
            document.documentElement.scrollHeight
        ) {
            this.updateCharacters(this.state.offset);
        }
    };
    componentDidMount() {
        this.updateCharacters();
        window.addEventListener('scroll', this.onScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.onScroll);
    }

    itemRefs = [];

    setRef = (ref) => {
        this.itemRefs.push(ref);
    };

    focusOnMouseItem = (id) => {
        this.itemRefs.forEach((item) =>
            item.classList.remove('char__item_selected-focus')
        );
        this.itemRefs[id].classList.add('char__item_selected-focus');
        this.itemRefs[id].focus();
    };

    focusOnClickItem = (id) => {
        this.itemRefs.forEach((item) =>
            item.classList.remove('char__item_selected')
        );
        this.itemRefs[id].classList.add('char__item_selected');
        this.itemRefs[id].focus();
    };

    renderEl(arr) {
        const item = arr.map((el, i) => {
            let imgStyle = { objectFit: 'cover' };
            if (
                el.thumbnail ===
                'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
            ) {
                imgStyle = { objectFit: 'fill' };
            }

            return (
                <li
                    ref={this.setRef}
                    tabIndex={0}
                    key={el.id}
                    onMouseOver={() => {
                        this.focusOnMouseItem(i);
                    }}
                    onClick={() => {
                        this.props.onCharSelected(el.id);
                        this.focusOnClickItem(i);
                    }}
                    onKeyUp={(e) => {
                        if (e.key === ' ' || e.key === 'Tab') {
                            this.focusOnMouseItem(i);
                        }
                    }}
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
                            this.props.onCharSelected(el.id);
                            this.focusOnClickItem(i);
                        }
                    }}
                    className="char__item"
                >
                    <img src={el.thumbnail} alt={el.name} style={imgStyle} />
                    <div className="char__name">{el.name}</div>
                </li>
            );
        });
        return <ul className="char__grid">{item}</ul>;
    }

    render() {
        const {
            characters,
            loading,
            errorLoad,
            newItemLoading,
            offset,
            charEnded,
        } = this.state;
        const item = this.renderEl(characters);

        return (
            <div className="char__list">
                {errorLoad ? <ErrorMessage /> : loading ? <Spinner /> : item}
                <button
                    onClick={() => this.updateCharacters(offset)}
                    disabled={newItemLoading}
                    style={{ display: charEnded ? 'none' : 'block' }}
                    className="button button__main button__long"
                >
                    <div className="inner">load more</div>
                </button>
            </div>
        );
    }
}

CharList.propTypes = {
    charId: PropTypes.number,
    onCharSelected: PropTypes.func,
};

export default CharList;
