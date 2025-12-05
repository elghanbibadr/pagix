/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"


import { createClient } from "@/utils/supabase/server";
import { getUser } from "./actions";
import { revalidatePath } from "next/cache";


export async function getUserWebsites() {
    try {
    const supabase =await  createClient();
const user=await getUser()
     

    const {data:website,error}=await supabase
    .from('websites')
    .select('*')
      .eq('user_id', user.user.id)



      console.log('web--',website, user.user.id,error)
    return {
      success: true,
      data: website,
    };
  } catch (error: any) {
    console.error('Error getting user websites:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch websites ',
    };
  }
}


// const userId=user.user

export async function createWebsite(data: {
  name: string;
  description: string;
}) {
  console.log("data", data);
  
  try {
    const supabase = await createClient();
    const user = await getUser();
     
    // Generate domain from project name
    const domain = data.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .substring(0, 63); // DNS domain max length

    // Check if domain already exists
    const { data: existingWebsite } = await supabase
      .from('websites')
      .select('id')
      .eq('domain', domain)
      .single();

    // ✅ If domain exists, return error before attempting insert
    if (existingWebsite) {
      return {
        success: false,
        error: `A website with the name "${data.name}" already exists. Please choose a different name.`,
      };
    }
   
    const { data: website, error } = await supabase
      .from('websites')
      .insert({
        user_id: user.user.id,
        name: data.name,
        domain: domain,
        description: data.description || null,
      })
      .select()
      .single();

    if (error) {
      // ✅ Check if it's a duplicate key error
      if (error.code === '23505') {
        return {
          success: false,
          error: `A website with similar name already exists. Please choose a different name.`,
        };
      }
      throw error;
    }

    // Create default home page
    const { error: pageError } = await supabase.from('pages').insert({
      website_id: website.id,
      name: 'Home',
      slug: 'home',
      content: '',
      is_home_page: true,
      order_index: 0,
    });

    if (pageError) throw pageError;

    return {
      success: true,
      data: website,
    };
  } catch (error: any) {
    console.error('Error creating website:', error);
    
    // ✅ Handle specific PostgreSQL error codes
    if (error.code === '23505') {
      // Duplicate key violation
      return {
        success: false,
        error: 'A website with this name already exists. Please choose a different name.',
      };
    }
    
    return {
      success: false,
      error: error.message || 'Failed to create website. Please try again.',
    };
  }
}


export async function loadWebsite(websiteId: string) {
  try {
    const supabase = await createClient();

    // Get website
    const { data: website, error: websiteError } = await supabase
      .from('websites')
      .select('*')
      .eq('id', websiteId)
      .single();

      console.log('website id',websiteId)
    if (websiteError) throw websiteError;

    // Get pages
    const { data: pages, error: pagesError } = await supabase
      .from('pages')
      .select('*')
      .eq('website_id', websiteId)
      .order('order_index', { ascending: true });

    if (pagesError) throw pagesError;

    return {
      success: true,
      data: { website, pages: pages || [] },
    };
  } catch (error: any) {
    console.error('Error loading website:', error);
    return {
      success: false,
      error: error.message || 'Failed to load website',
    };
  }
}


export const deletePageAction = async (pageId: string) => {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from('pages')
      .delete()
      .eq('id', pageId);

    if (error) throw error;

    console.log('✅ Page deleted:', pageId);
    return { success: true };
    
  } catch (error) {
    console.error('❌ Error deleting page:', error);
    throw error;
  }
};


const savePageContent = async (id: string, content: JSON) => {
  const supabase = await createClient();

    try {
      const { error } = await supabase
        .from('pages')
        .update({ content })
        .eq('id', id);

      if (error) throw error;

      console.log('✅ Page content saved to database:', id);
    } catch (error) {
      console.error('Error saving page content:', error);
      throw error;
    }
  }


// ADD NEW PAGE
// app/actions/websitesActions.ts

export const addPageAction = async (
  name: string,
  websiteId: string,
  slug: string,
  content: any = ""
) => {
  const supabase = await createClient();

  try {
    console.log('📄 Creating page:', { name, websiteId, slug });

    // ✅ Check if a page with this name already exists
    const { data: existingPage, error: checkError } = await supabase
      .from('pages')
      .select('id, name')
      .eq('website_id', websiteId)
      .eq('name', name)
      .maybeSingle();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    if (existingPage) {
      console.log('❌ Page with this name already exists:', existingPage);
      return {
        success: false,
        error: `A page named "${name}" already exists. Please choose a different name.`,
      };
    }

    // ✅ Check slug
    const { data: existingSlug, error: slugCheckError } = await supabase
      .from('pages')
      .select('id, slug')
      .eq('website_id', websiteId)
      .eq('slug', slug)
      .maybeSingle();

    if (slugCheckError && slugCheckError.code !== 'PGRST116') {
      throw slugCheckError;
    }

    if (existingSlug) {
      console.log('❌ Page with this slug already exists:', existingSlug);
      return {
        success: false,
        error: `A page with URL "${slug}" already exists. Please choose a different name.`,
      };
    }

    // Get the highest order_index
    const { data: pages } = await supabase
      .from('pages')
      .select('order_index')
      .eq('website_id', websiteId)
      .order('order_index', { ascending: false })
      .limit(1);

    const nextOrderIndex = pages && pages.length > 0 ? (pages[0].order_index || 0) + 1 : 0;

    // ✅ Create the page
    const { data: newPage, error: insertError } = await supabase
      .from('pages')
      .insert({
        website_id: websiteId,
        name: name,
        slug: slug,
        content: content,
        is_home_page: false,
        order_index: nextOrderIndex,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    console.log('✅ Page created successfully:', newPage);
    
    return {
      success: true,
      data: newPage,
    };
    
  } catch (error) {
    console.error('❌ Error creating page:', error);
    return {
      success: false,
      error: 'Failed to create page. Please try again.',
    };
  }
};


export async function getPagesByWebsiteId(
  websiteId: string
) {
  try {
    const supabase =await  createClient();

 

    console.log('website id',websiteId)
    


    // Get all pages for this website
    const { data: pages, error: pagesError } = await supabase
      .from('pages')
      .select('*')
      .eq('website_id', websiteId)
      .order('order_index', { ascending: true });

      console.log('pages error',pagesError)

    if (pagesError) throw pagesError;

    console.log('✅ Retrieved pages:', pages?.length || 0);

    return {
      success: true,
      data: pages || [],
    };
  } catch (error: any) {
    console.error('Error getting pages:', error);
    return {
      success: false,
      error: error.message || 'Failed to get pages',
    };
  }
}


// Update page content
export const updatePageContentAction = async (pageId: string, content: any) => {
  console.log('page id',pageId)
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from('pages')
      .update({
        content: content,
        updated_at: new Date().toISOString(),
      })
      .eq('id', pageId)
      .select()
      .single();

    if (error) throw error;

    console.log(' Page content updated:', data);
    return data;
    
  } catch (error) {
    console.error(' Error updating page content:', error);
    throw error;
  }
};

// Update page metadata (name, slug, meta tags, etc.)
export const updatePageMeta = async (
  pageId: string, 
  updates: {
    name?: string;
    slug?: string;
    meta_title?: string;
    meta_description?: string;
    is_published?: boolean;
    is_home_page?: boolean;
  }
) => {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from('pages')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', pageId)
      .select()
      .single();

    if (error) throw error;

    console.log(' Page metadata updated:', data);
    return data;
    
  } catch (error) {
    console.error(' Error updating page metadata:', error);
    throw error;
  }
};

// Delete page
export const deletePage = async (pageId: string) => {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from('pages')
      .delete()
      .eq('id', pageId);

    if (error) throw error;

    console.log('Page deleted:', pageId);
    return { success: true };
    
  } catch (error) {
    console.error(' Error deleting page:', error);
    throw error;
  }
};

export const updatePageMetaAction = async (
  pageId: string, 
  updates: {
    name?: string;
    slug?: string;
    meta_title?: string;
    meta_description?: string;
    is_published?: boolean;
    is_home_page?: boolean;
  }
) => {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from('pages')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', pageId)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/builder")

    console.log('✅ Page metadata updated:', data);
    return data;
    
  } catch (error) {
    console.error('❌ Error updating page metadata:', error);
    throw error;
  }
};


// app/actions/websitesActions.ts

// Delete website and all its pages
export const deleteWebsiteAction = async (websiteId: string) => {
  const supabase = await createClient();

  try {
    console.log('🗑️ Deleting website:', websiteId);

    // Step 1: Delete all pages associated with this website
    const { error: pagesError } = await supabase
      .from('pages')
      .delete()
      .eq('website_id', websiteId);

    if (pagesError) {
      console.error('❌ Error deleting pages:', pagesError);
      throw pagesError;
    }

    console.log('✅ All pages deleted for website:', websiteId);

    // Step 2: Delete the website itself
    const { error: websiteError } = await supabase
      .from('websites')
      .delete()
      .eq('id', websiteId);

    if (websiteError) {
      console.error('❌ Error deleting website:', websiteError);
      throw websiteError;
    }

    console.log('✅ Website deleted successfully:', websiteId);
    
    return { success: true };
    
  } catch (error) {
    console.error('❌ Error deleting website:', error);
    throw error;
  }
};






// app/actions/websitesActions.ts

// Update website settings
export const updateWebsiteAction = async (
  websiteId: string,
  updates: {
    name?: string;
    description?: string;
    domain?: string;
  }
) => {
  const supabase = await createClient();

  try {
    console.log('🔄 Updating website:', websiteId, updates);

    const { data, error } = await supabase
      .from('websites')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', websiteId)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating website:', error);
      throw error;
    }

    console.log('✅ Website updated successfully:', data);
    return data;
    
  } catch (error) {
    console.error('❌ Error updating website:', error);
    throw error;
  }
};