import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import MetaTags from 'react-meta-tags';

import { fetchSettings, fetchPosts } from '../actions/index';

import Post from './Post';

class PostList extends Component {
    componentWillMount() {
	/* console.log(">>>> src/components/post_list.js:");
	   console.log("Calling fetchPosts() action creator.");		*/
	/* Fetch posts when the app loads */
	this.props.fetchPosts(this.props.params.category);
	this.props.fetchSettings();	
    }

    componentDidUpdate(nextProps) {
	if ((this.props.route.path !== nextProps.route.path) ||
	    (nextProps.params.category !== this.props.params.category)) {
	    /* If the route has changed - refetch the posts.
	       Gotta check if route is different with the if statement,
	       without the if statement it will fetch posts,
	       which will update props, which will fetch them again,
	       in infinite loop.
	       comparing route.path's  checks if I've switched
	       between "/" and "/category/some-category"
	       copmaring params checks if I've switched
	       between "/category/" and "/category/some-other-category"
	     */
	    this.props.fetchPosts(this.props.params.category);
	}
    }

    renderPosts() {
	const posts = this.props.posts.results;
	/* console.log(">>>> src/components/post_list.js:");
	   console.log("Rendering posts.");
	 */

	/* If there are no posts in the state (haven't fetched them yet) -
	   render an empty div in their place. */
	if (!posts) { return ( <div></div> ); };
	
	return posts.map((post) => {
	    if (post.published || this.props.authenticated) {
		return (
		    <Post key={post.slug}
			  title={post.title}
			  slug={post.slug}			  
			  body={post.body}
			  published={post.published}
			  authenticated={this.props.authenticated}
			  category={post.category}		      
			  tags={post.tags}
			  truncate={100}
			  link={`/post/${post.slug}`}/>
		)
	    }
	});
    }

    renderMetaInfo () {
	const settings =  this.props.settings;

	if (!settings.title ) { return null; }

	return (
            <MetaTags>
		{/* Main */}
		<title>{settings.title}</title>
		<meta name="author" content={settings.author} />  
		<meta name="description"
		      content={settings.description} />
		<meta name="keywords"
		      content={settings.keywords} />
		{/* Facebook */}
		<meta property="og:title" content={settings.title} />
		<meta property="og:image" content={settings.image_social} />
		{/* Twitter */}
		<meta property="twitter:card" content="summary_large_image" />
		<meta property="twitter:image" content={settings.image_social} />
            </MetaTags>
	);
    }
    
    render() {
	return (
	    <div>
		{ this.renderMetaInfo() }
		{ this.renderPosts() }
	    </div>
	);
    }
}


function mapStateToProps(state) {
    return { posts: state.posts.all,
    	     settings: state.settings.all,
    	     authenticated: state.auth.authenticated};
}
/* First argument connects redux state to the component,
   allowing to access it with "this.props.posts" */
/* Second argument connects the actions to the component,
   allowing me to fire them like "this.props.fetchPosts()" */
export default connect(mapStateToProps, { fetchPosts, fetchSettings })(PostList);
