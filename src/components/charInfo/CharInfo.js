import { Component } from 'react';
import MarvelServices from '../../services/MarvelServices';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';

import './charInfo.scss';

class CharInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            char: null,
            loading: false,
            errorLoad: false,
        };
    }

    marvelServices = new MarvelServices();

    onCharLoaded = (res) => {
        this.setState({ char: res, loading: false });
    };

    onCharLoading = () => {
        this.setState({
            loading: true,
        });
    };

    onError = () => {
        this.setState({ loading: false, errorLoad: true });
    };

    updateChar = () => {
        const { charId } = this.props;

        if (!charId) {
            return;
        }
        this.onCharLoading();
        this.marvelServices
            .getCharacter(charId)
            .then(this.onCharLoaded)
            .catch(this.onError);
    };

    componentDidMount() {
        this.updateChar();
    }

    componentDidUpdate(prevProps) {
        if (this.props.charId !== prevProps.charId) {
            this.updateChar();
        }
    }

    render() {
        const { char, loading, errorLoad } = this.state;

        const skeleton = char || loading || errorLoad ? null : <Skeleton />;
        const errorMessage = errorLoad ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner /> : null;
        const content = !(loading || errorLoad || !char) ? (
            <View char={char} />
        ) : null;

        return (
            <div className="char__info">
                {skeleton}
                {errorMessage}
                {spinner}
                {content}
            </div>
        );
    }
}

const View = ({ char }) => {
    const { name, description, thumbnail, homepage, wiki, comics } = char;

    let imgStyle = { objectFit: 'cover' };
    if (
        thumbnail ===
        'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
    ) {
        imgStyle = { objectFit: 'fill' };
    }

    const comicsName = comics.map((el, i) => {
        return (
            <li key={i} className="char__comics-item">
                {el.name}
            </li>
        );
    });

    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={imgStyle} />
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">{description}</div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length > 0
                    ? comicsName
                    : 'Unfortunately there are no comics on this character'}
            </ul>
        </>
    );
};

export default CharInfo;
