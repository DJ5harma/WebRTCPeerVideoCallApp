export const load = async ({ params }: { params: { slug: string } }) => {
	return { slug: params.slug };
};
