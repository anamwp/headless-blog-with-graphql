# Headless Blog with GraphQL

A modern headless blog powered by GraphQL and WordPress. This project enables seamless data fetching via GraphQL for a flexible and scalable headless CMS experience.

## 🚀 Features
- Fetch WordPress blog posts using GraphQL.
- Headless CMS setup for decoupled front-end development.
- Efficient and optimized API queries with WPGraphQL.
- Fully customizable and extendable structure.

## 🛠️ Installation

##### 1️⃣ Prerequisites

Before getting started, ensure you have the following installed:
- WordPress (latest version)
- [WPGraphQL](https://wordpress.org/plugins/wp-graphql/) Plugin for GraphQL API support
- [JWT Authentication for WP REST API](https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/) Plugin for login functionality
- Node.js(LTS) and npm/yarn (for front-end setup)

##### 2️⃣ Setup WordPress Backend
1.	Install WordPress and activate the WPGraphQL plugin.
2.  Activate JWT Authentication for WP REST API plugin and configure it based on plugin documentation.
3.	Configure WordPress permalinks to Post Name for proper API responses.
4.	Verify the GraphQL API is accessible at:

`https://your-wordpress-site.com/graphql`


##### 3️⃣ Clone the Repository

git clone https://github.com/anamwp/headless-blog-with-graphql.git
cd headless-blog-with-graphql

##### 4️⃣ Install Dependencies

`npm install` or `yarn install`

##### 5️⃣ Configure API Endpoint

Update the GraphQL API URL in your .env file:

NEXT_PUBLIC_GRAPHQL_API=https://your-wordpress-site.com/graphql
```
SITE_DOMAIN=yoursite.com
WP_SITE_URL=http://yoursite.com
NEXT_PUBLIC_API_SITE_URL=http://yoursite.com
NEXT_PUBLIC_API_URL=http://yoursite.com/wp-json/wp/v2
NEXT_PUBLIC_API_URL_JWT=http://yoursite.com/wp-json
NEXT_PUBLIC_API_FOR_JWT_TOKEN=http://yoursite.com/wp-json/jwt-auth/v1/token
NEXT_PUBLIC_GRAPHQL_URL=http://yoursite.com/graphql
NEXT_PUBLIC_POSTS_PER_PAGE=9
NEXT_PUBLIC_PRIMARY_MENU_ID=35
```

6️⃣ Run the Development Server

`npm run dev`  or  `yarn dev`

The application will be available at http://localhost:3000.

### 📌 Usage
Fetch all posts using GraphQL query:

```graphql
query GetAllPosts {
  posts {
    nodes {
      id
      title
      excerpt
      slug
    }
  }
}
```

Fetch a single post by slug:

```graphql
query GetPostBySlug($slug: String!) {
  postBy(slug: $slug) {
    title
    content
    date
    author {
      node {
        name
      }
    }
  }
}
```

## ⚡ Technologies Used
- WordPress (as Headless CMS)
- WPGraphQL (GraphQL API for WordPress)
- Next.js / React (Front-end framework)
- Apollo Client (GraphQL client for data fetching)

## 📌 Roadmap
- Implement category-based filtering
- Add pagination for posts
- Improve caching with Apollo Client
- Support for additional custom post types

## 💡 Contributing

We welcome contributions! To contribute:
	1.	Fork the repository.
	2.	Create a new branch: git checkout -b feature-branch
	3.	Commit your changes: git commit -m "Add new feature"
	4.	Push to the branch: git push origin feature-branch
	5.	Open a Pull Request.

## 📜 License

This project is licensed under the MIT License. See the LICENSE file for details.

## 📞 Support

For any issues, feel free to open an issue on the GitHub repository.